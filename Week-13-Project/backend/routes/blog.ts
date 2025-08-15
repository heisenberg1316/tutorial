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

export function extractCloudinaryPublicId(imageUrl: string): string {
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

    const q = c.req.query('query') || "";
    let tagsParam = c.req.query('tags') || ""; // e.g. "React,JS"

    tagsParam = tagsParam.toLowerCase();

    const tagsArray = Array.isArray(tagsParam)
      ? tagsParam
      : String(tagsParam || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    console.log("tags array is ", tagsArray);

    // Build "where" filter
    const andClauses: any[] = [];

    if (tagsArray.length > 0) {
      andClauses.push({
        tags: {
          some: {
            name: { in: tagsArray },
          },
        },
      });
    }

    if (q) {
      andClauses.push({
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      });
    }

    const where = andClauses.length > 0 ? { AND: andClauses } : undefined;

    const blogs = await prisma.blog.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: {
        createdAt: 'desc',
      },
      where,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        imageLink: true,
        // return only tag names:
        tags: { select: { id : true, name: true } },
        author: {
          select: {
            name: true
          }
        }
      },
    });

    const hasMore = blogs.length === limit + 1;
    const nextCursor = hasMore ? blogs[limit - 1].id : null;



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


// GET: Get blog by ID with all comments
blogRouter.get('/:id', async (c) => {
    try {
      const id = c.req.param("id");
      const prisma = getPrisma(c);
      const userId = c.get("userId");

     const blog = await prisma.blog.findFirst({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          imageLink: true,
          createdAt: true,
          upvotes: true,
          tags: { select: { name: true, id: true } },
          author: { select: { name: true, email: true, imageLink: true } },

          // return ALL comments (you asked for that)
          comments: {
            orderBy: { createdAt: 'desc' }, // newest first; use 'asc' for oldest-first
            select: {
              id: true,
              content: true,
              createdAt: true,
              edited: true,     // <--- include edited flag
              editedAt: true,   // <--- include edited timestamp
              likesCount: true,
              author: { select: { id: true, name: true, email: true, imageLink: true } },
              // small check whether current user liked this comment (returns [] or [{id}])
              likedBy: { where: { id: userId }, select: { id: true } }
            },
          },

          // whether current user liked the blog
          _count: { select: { upvotedBy: { where: { id: userId } } } },
        },
      });


      if (!blog) return c.json({ message: "Blog not found" }, 404);

      const likedByUser = blog._count.upvotedBy > 0;

      const allComments = (blog.comments || []).map(c => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        edited: c.edited,
        editedAt: c.editedAt,
        likesCount: c.likesCount ?? (c.likedBy?.length || 0),
        likedByUser: Array.isArray(c.likedBy) && c.likedBy.length > 0,
        author: c.author,
      }));


      return c.json({
        blog: {
          id: blog.id,
          title: blog.title,
          content: blog.content,
          imageLink: blog.imageLink,
          createdAt: blog.createdAt,
          upvotes: blog.upvotes,
          author: blog.author,
          tags: blog.tags,
          comments: allComments,
        },
        likedByUser,
      }, 200);

    } catch (e) {
      console.error(e);
      return c.json({ message: "Error while fetching blog post" }, 500);
    }
});




blogRouter.post('/:id/comments', async (c) => {
    try {
      const blogId = c.req.param('id');
      const body = await c.req.json();
      console.log("bloid is ", blogId);
      console.log("body is ", body);
      const content = (body?.content ?? '').toString().trim();
      if (!content) return c.json({ success: false, error: 'Comment cannot be empty' }, 400);

      const prisma = getPrisma(c);
      const userId = c.get('userId');

      // ensure blog exists
      const blog = await prisma.blog.findUnique({ where: { id: blogId }, select: { id: true } });
      if (!blog) return c.json({ success: false, error: 'Blog not found' }, 404);

      const newComment = await prisma.comment.create({
        data: {
          blogId,
          authorId: userId,
          content,
          // likesCount stays default 0
        },
        include: {
          author: { select: { id: true, name: true, imageLink: true, email: true } }
        }
      });

      console.log("newcommetn is ", newComment);

      // shape response
      const shaped = {
        id: newComment.id,
        blogId: newComment.blogId,
        author: newComment.author,
        content: newComment.content,
        createdAt: newComment.createdAt,
        edited: newComment.edited,
        likesCount: newComment.likesCount ?? 0,
        likedByUser: false
      };

      return c.json({ success: true, comment: shaped }, 201);
    } catch (err) {
      console.error(err);
      return c.json({ success: false, error: 'Failed to create comment' }, 500);
  }
});

// PUT: Edit a comment
blogRouter.put('/comments/:commentId', async (c) => {
  try {
    const commentId = c.req.param('commentId');
    const body = await c.req.json();
    const content = (body?.content ?? '').toString().trim();
    if (!content) return c.json({ success: false, error: 'Comment cannot be empty' }, 400);

    const prisma = getPrisma(c);
    const userId = c.get('userId');

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true },
    });

    if (!existing) return c.json({ success: false, error: 'Comment not found' }, 404);
    if (existing.authorId !== userId) return c.json({ success: false, error: 'Unauthorized' }, 403);

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content, edited: true, editedAt: new Date() },
      include: {
        author: { select: { id: true, name: true, imageLink: true, email: true } },
        // include likedBy for current-user check (small selection)
        likedBy: { where: { id: userId }, select: { id: true } },
      },
    });

    const shaped = {
      id: updated.id,
      blogId: updated.blogId,
      author: updated.author,
      content: updated.content,
      createdAt: updated.createdAt,
      edited: updated.edited,
      editedAt: updated.editedAt,
      likesCount: updated.likesCount ?? (Array.isArray(updated.likedBy) ? updated.likedBy.length : 0),
      likedByUser: Array.isArray(updated.likedBy) && updated.likedBy.length > 0,
    };

    return c.json({ success: true, comment: shaped }, 200);
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: 'Failed to update comment' }, 500);
  }
});


// DELETE: Delete a comment
blogRouter.delete('/comments/:commentId', async (c) => {
  try {
    const commentId = c.req.param('commentId');
    const prisma = getPrisma(c);
    const userId = c.get('userId');

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true },
    });

    if (!existing) return c.json({ success: false, error: 'Comment not found' }, 404);
    if (existing.authorId !== userId) return c.json({ success: false, error: 'Unauthorized' }, 403);

    await prisma.comment.delete({ where: { id: commentId } });

    return c.json({ success: true, message: 'Comment deleted' }, 200);
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: 'Failed to delete comment' }, 500);
  }
});

// POST: Toggle like/unlike on a comment
blogRouter.post('/comments/:commentId/like', async (c) => {
  try {
    const commentId = c.req.param('commentId');
    const prisma = getPrisma(c);
    const userId = c.get('userId');

    if (!userId) return c.json({ success: false, error: 'Unauthorized' }, 401);

    const result = await prisma.$transaction(async (tx) => {
      // 1) fetch current membership
      const current = await tx.comment.findUnique({
        where: { id: commentId },
        include: { likedBy: { select: { id: true } } },
      });

      if (!current) throw new Error('Comment not found');

      const already = current.likedBy.some((u) => u.id === userId);

      // 2) toggle connect/disconnect and adjust likesCount
      if (already) {
        await tx.comment.update({
          where: { id: commentId },
          data: {
            likedBy: { disconnect: { id: userId } },
          },
        });
      } else {
        await tx.comment.update({
          where: { id: commentId },
          data: {
            likedBy: { connect: { id: userId } },
          },
        });
      }

      // 3) re-fetch fresh data and compute authoritative likesCount
      const fresh = await tx.comment.findUnique({
        where: { id: commentId },
        include: { likedBy: { select: { id: true } } },
      });

      if (!fresh) throw new Error('Comment not found after update');

      const count = fresh.likedBy?.length ?? 0;

      // 4) persist canonical likesCount
      await tx.comment.update({
        where: { id: commentId },
        data: { likesCount: count < 0 ? 0 : count },
      });

      // final return
      return {
        id: commentId,
        likesCount: count,
        likedByUser: fresh.likedBy.some((u) => u.id === userId),
      };
    });

    return c.json({ success: true, ...result }, 200);
  } catch (err) {
    console.error("Toggle comment like error:", err);
    if (err instanceof Error && err.message === 'Comment not found') {
      return c.json({ success: false, error: 'Comment not found' }, 404);
    }
    return c.json({ success: false, error: 'Failed to toggle like' }, 500);
  }
});






export default blogRouter;
