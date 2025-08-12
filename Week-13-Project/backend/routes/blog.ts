import { Hono } from "hono"
import Env from "../types/env"
import { Variable } from "../types/variables";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@mukul1316/common";
import { treeifyError } from "zod";
import getPrisma from "../services/client";
import { getCookie } from "hono/cookie";
import { sha1 } from "hono/utils/crypto";


type AppContext = {
    Bindings: Env['Bindings'],
    Variables: Variable
}

const blogRouter = new Hono<AppContext>();

function extractCloudinaryPublicId(imageUrl: string): string {
  // Example input: https://res.cloudinary.com/xxx/image/upload/v1234567890/abc123.jpg
  const parts = imageUrl.split('/');
  const filename = parts[parts.length - 1]; // abc123.jpg
  return filename.split('.')[0]; // abc123
}


// Auth middleware
blogRouter.use("/*", async (c, next) => {
    const token = getCookie(c, 'accessToken');

    if (!token) return c.json({ error: 'Not authenticated' }, 401);

    try {
        const decoded = await verify(token, c.env.JWT_SECRET) as { userId: string };
        c.set("userId", decoded.userId);
        await next();
    }
    catch {
        return c.json({ error: 'Invalid token' }, 403);
    }
});

// POST: Create blog
blogRouter.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const result = createBlogInput.safeParse(body)

        if (!result.success) {
        const errorTree = treeifyError(result.error)
        return c.json({ success: false, error: errorTree }, 400)
        }

        const authorId = c.get('userId')
        const prisma = getPrisma(c)

        let uploadedImageUrl = null

        // Upload to Cloudinary using REST
        if (body.image) {
            const timestamp = Math.floor(Date.now() / 1000).toString()

            // Generate signature (SHA1 HMAC of params + API secret)
            const paramsToSign = `timestamp=${timestamp}`
            const signature = await sha1(paramsToSign + c.env.CLOUDINARY_API_SECRET)

            const form = new FormData()
            form.set('file', body.image) // base64 or URL
            form.set('api_key', c.env.CLOUDINARY_API_KEY)
            form.set('timestamp', timestamp)
            form.set('signature', signature || '')

            const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: form,
            })

            if (!res.ok) {
                console.error('Cloudinary error', await res.text())
                return c.json({ error: 'Blog Image upload failed' }, 500)
            }

            const uploadResult = await res.json()
            uploadedImageUrl = uploadResult.secure_url
        }
        
        const blog = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorId,
                published: body.published,
                imageLink: uploadedImageUrl,
                tags: {
                    connectOrCreate: body.tags.map((tagName: string) => {
                        const lowerTag = tagName.toLowerCase();
                        return {
                            where: { name: lowerTag },
                            create: { name: lowerTag },
                        };
                    })
                },
            },
        })

        return c.json({ message: 'Blog created successfully' }, 200)
    } catch (err) {
        console.error(err)
        return c.json({ error: 'Internal server error' }, 500)
    }
})

//delete blog
blogRouter.delete('/:id', async (c) => {
    try {
        const blogId = c.req.param('id');
        const userId = c.get('userId');
        const prisma = getPrisma(c);

        const blog = await prisma.blog.findUnique({
        where: { id: blogId },
        select: { authorId: true, imageLink: true },
        });

        if (!blog) {
        return c.json({ success: false, error: 'Blog not found' }, 404);
        }

        if (blog.authorId !== userId) {
        return c.json({ success: false, error: 'Unauthorized' }, 403);
        }

        // ✅ Delete image from Cloudinary if it exists
        if (blog.imageLink) {
        const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = c.env.CLOUDINARY_API_KEY;
        const apiSecret = c.env.CLOUDINARY_API_SECRET;

        // Extract public_id from imageLink
        const publicId = extractCloudinaryPublicId(blog.imageLink);
        const timestamp = Math.floor(Date.now() / 1000).toString();

        const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        const signature = await sha1(stringToSign);

        const form = new URLSearchParams();
        form.set('public_id', publicId);
        form.set('api_key', apiKey);
        form.set('timestamp', timestamp);
        form.set('signature', signature || "");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: 'POST',
            body: form,
        });

        if (!res.ok) {
            console.error('Cloudinary deletion error:', await res.text());
        }
        }

        // ✅ Delete blog from database
        await prisma.blog.delete({
        where: { id: blogId },
        });

        return c.json({ success: true, message: 'Blog deleted successfully' }, 200);
    } catch (err) {
        console.error('Delete blog error:', err);
        return c.json({ success: false, error: 'Internal server error' }, 500);
    }
});


//put blog upvote increase

// Using Prisma in an async route handler
// backend/routes/blog.ts (fixed route)
blogRouter.put("/upvotes", async (c) => {
  try {
    const body = await c.req.json();
    const { id } = body;
    if (!id) return c.json({ error: "Missing blog id" }, 400);

    const prisma = getPrisma(c);
    const userId = c.get("userId");
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    // Run the toggle inside a transaction and return the final blog object
    const updatedBlog = await prisma.$transaction(async (tx) => {
      // 1) fetch current membership
      const current = await tx.blog.findUnique({
        where: { id },
        include: { upvotedBy: { select: { id: true } } },
      });

      if (!current) throw new Error("Blog not found");

      const already = current.upvotedBy.some((u) => u.id === userId);

      // 2) toggle connect/disconnect
      if (already) {
        await tx.blog.update({
          where: { id },
          data: { upvotedBy: { disconnect: { id: userId } } },
        });
      } else {
        await tx.blog.update({
          where: { id },
          data: { upvotedBy: { connect: { id: userId } } },
        });
      }

      // 3) re-fetch fresh data and compute authoritative upvotes
      const fresh = await tx.blog.findUnique({
        where: { id },
        include: {
          upvotedBy: { select: { id: true } },
          author: { select: { id: true, name: true, imageLink: true } }, // optional
          tags: true, // optional
        },
      });

      if (!fresh) throw new Error("Blog not found after update");

      const count = fresh.upvotedBy?.length ?? 0;
      const final = await tx.blog.update({
        where: { id },
        data: { upvotes: count < 0 ? 0 : count },
        select: {
          id: true,
          upvotes: true,
          upvotedBy: { select: { id: true } },
          // add any other fields you need to return
        },
      });

      return final; // <-- return the final object (not an array)
    });

    return c.json({
      message: "Toggled upvote",
      blog: updatedBlog,
    });
  } catch (err) {
    console.error(err);
    // If the transaction threw because blog not found, return 404
    if (err instanceof Error && err.message === "Blog not found") {
      return c.json({ error: "Blog not found" }, 404);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});



// PUT: Update blog
blogRouter.put("/:id", async (c) => {
    try {
        const body = await c.req.json();
        console.log("body is ", body);
        const id = c.req.param("id");      // path param
        const prisma = getPrisma(c);
        const userId = c.get("userId"); 
        
        const blog = await prisma.blog.findUnique({
            where: { id: id },
        });

        if (!blog) {
            return c.json({ message: "No blog exists with the given ID" }, 404);
        }

        if (blog.authorId !== userId) {
            return c.json({ message: "You are not authorized to update this blog" }, 403);
        }

        let uploadedImageUrl = null

        // Upload to Cloudinary using REST
        if (body.blogPost.image) {
            const timestamp = Math.floor(Date.now() / 1000).toString()
            console.log("inside if");

            // Generate signature (SHA1 HMAC of params + API secret)
            const paramsToSign = `timestamp=${timestamp}`
            const signature = await sha1(paramsToSign + c.env.CLOUDINARY_API_SECRET)

            const form = new FormData()
            form.set('file', body.blogPost.image) // base64 or URL
            form.set('api_key', c.env.CLOUDINARY_API_KEY)
            form.set('timestamp', timestamp)
            form.set('signature', signature || '')

            const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: form,
            })

            if (!res.ok) {
                console.error('Cloudinary error', await res.text())
                return c.json({ error: 'Blog Image upload failed' }, 500)
            }

            const uploadResult = await res.json()
            uploadedImageUrl = uploadResult.secure_url
            console.log("uplodimageurl is ", uploadedImageUrl)
        }

        const updatedBlog = await prisma.blog.update({
            where: { id: id },
            data: {
                title: body.blogPost.title,
                content: body.blogPost.content,
                imageLink : uploadedImageUrl,
                published : body.blogPost.published,
                tags: {
                    connectOrCreate: body.blogPost.tags.map((tagName: string) => {
                        const lowerTag = tagName.toLowerCase();
                        return {
                            where: { name: lowerTag },
                            create: { name: lowerTag },
                        };
                    })
                },
            },
        });

        return c.json({ message: "Blog updated successfully", blog: updatedBlog }, 200);
    }
    catch (err) {
        console.error(err);
        return c.json({ error: "Internal server error" }, 500);
    }
});


// GET: Get all blogs
blogRouter.get('/bulk', async (c) => {
    try {
        const prisma = getPrisma(c);
        const cursor = c.req.query('cursor'); // expecting blog id
        const limit = parseInt(c.req.query('limit') || '10');

        const blogs = await prisma.blog.findMany({
            take: limit + 1, // fetch 1 extra to check if there's more
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0, // skip the cursor itself
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                imageLink: true,
                tags: true,
                author: {
                    select: {
                        name: true
                    }
                }
            },
        });

        const hasMore = blogs.length > limit;
        const nextCursor = hasMore ? blogs[limit].id : null;

        return c.json({
        blogs: hasMore ? blogs.slice(0, limit) : blogs,
        nextCursor,
        hasMore,
        }, 200);

    } catch (err) {
        console.error(err);
        return c.json({ error: "Failed to fetch blogs" }, 500);
    }
});


// GET: Get blog by ID
blogRouter.get('/:id', async (c) => {
    try {
        const id = c.req.param("id");
        const prisma = getPrisma(c);
        const userId = c.get("userId")

        const blog = await prisma.blog.findFirst({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                imageLink: true,
                createdAt: true,
                upvotes: true, // pre-calculated count field
                tags: { select: { name: true, id: true } },
                author: { select: { name: true, email : true, imageLink: true } },
                _count: {
                    select: {
                        upvotedBy: { where: { id: userId } } // just checking if current user liked
                    }
                }
            }
        });

        if(!blog) return c.json({message: "Blog not found" }, 404);

        const likedByUser = blog._count.upvotedBy > 0;
        delete blog?._count;

        return c.json({ blog, likedByUser });
    }
    catch (e) {
        console.error(e);
        return c.json({ message: "Error while fetching blog post" }, 500);
    }
});


export default blogRouter;
