import { Hono } from "hono";
import getPrisma from "../services/client";
import { sign, verify } from "hono/jwt";
import Env from "../types/env";
import { signupInput, signinInput } from "@mukul1316/common";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { success, treeifyError } from "zod";
import { Variable } from "../types/variables";
import { sha1 } from "hono/utils/crypto";
import { extractCloudinaryPublicId } from "./blog";

type AppContext = {
    Bindings: Env['Bindings'],
    Variables: Variable
}

const userRouter = new Hono<AppContext>();

// POST /refresh-token
userRouter.post("/refresh-token", async (c) => {
  const token = getCookie(c, "refreshToken");
  if (!token)
    return c.json({ success: false, error: "Refresh token missing" }, 403);

  try {
    const payload = await verify(token, c.env.JWT_SECRET) as { userId: string };

    const accessToken = await sign(
      {
        userId: payload.userId,
        exp: Math.floor(Date.now() / 1000) + 60 * 15,
      },
      c.env.JWT_SECRET,
      "HS256"
    );

    setCookie(c, "accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 60 * 15,
    });

    return c.json({ success: true, message: "Access token refreshed" });
  }
  catch {
    return c.json({ success: false, error: "Invalid or expired refresh token" }, 403);
  }
});

// GET /me
userRouter.get("/me", async (c) => {
  const token1 = getCookie(c, "accessToken");
  const token2 = getCookie(c, "refreshToken");

  if(!token2)
    return c.json({success : false, error : "Not authenticated"}, 403);

  if (!token1)
    return c.json({ success: false, error: "Access Token missing" }, 401);

  try {
    const decoded = await verify(token1, c.env.JWT_SECRET) as { userId: string };
    const prisma = getPrisma(c);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, bio : true, imageLink : true, createdAt : true, profileViews : true},
    });

    return c.json({ success: true, data: user });
  } catch {
    return c.json({ success: false, error: "Invalid token"}, 403);
  }
});

// POST /signup
userRouter.post("/signup", async (c) => {
  try {
    const prisma = getPrisma(c);
    const body = await c.req.json();
    console.log("body is ", body);

    const result = signupInput.safeParse(body);
    if (!result.success) {
      const errorTree = treeifyError(result.error);
      return c.json({ success: false, error: errorTree }, 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return c.json({ success: false, error: "User already exists with this email" }, 409);
    }

    let uploadedImageUrl = null
    
    // Upload to Cloudinary using REST
    if (body.profileImage) {
      const timestamp = Math.floor(Date.now() / 1000).toString()

      // Generate signature (SHA1 HMAC of params + API secret)
      const paramsToSign = `timestamp=${timestamp}`
      const signature = await sha1(paramsToSign + c.env.CLOUDINARY_API_SECRET)

      const form = new FormData()
      form.set('file', body.profileImage) // base64 or URL
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
          return c.json({ error: 'User Image upload failed' }, 500)
      }

      const uploadResult = await res.json()
      uploadedImageUrl = uploadResult.secure_url
    }


    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        bio : body.bio,
        password: body.password,
        imageLink : uploadedImageUrl,
      },
    });

    return c.json({
      success: true,
      message: "User signup successful",
    }, 200);
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: "Internal server error during signup" }, 500);
  }
});



// POST /signin
userRouter.post("/signin", async (c) => {
  try {
    const prisma = getPrisma(c);
    const body = await c.req.json();

    const result = signinInput.safeParse(body);
    if (!result.success) {
      const errorTree = treeifyError(result.error);
      return c.json({ success: false, error: errorTree }, 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return c.json({ success: false, error: "User not found" }, 403);
    }

    if (user.password !== body.password) {
      return c.json({ success: false, error: "Email or password is incorrect" }, 400);
    }

    const accessToken = await sign(
      {
        userId: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 15,
      },
      c.env.JWT_SECRET,
      "HS256"
    );

    const refreshToken = await sign(
      {
        userId: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      c.env.JWT_SECRET,
      "HS256"
    );

    setCookie(c, "accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 60 * 15,
    });

    setCookie(c, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 7,
    });

    return c.json({
      success: true,
      message: "Signin successful",
      data: { id: user.id, email: user.email, name: user.name, bio : user.bio, imageLink : user.imageLink, createdAt : user.createdAt, profileViews : user.profileViews }
    });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: "Internal server error during signin" }, 500);
  }
});


//POST user blogs 
userRouter.post("/my-blogs", async (c) => {
    try {
      const token1 = getCookie(c, "accessToken");
      const token2 = getCookie(c, "refreshToken");

      if (!token2)
        return c.json({ success: false, error: "Not authenticated" }, 403);

      if (!token1)
        return c.json({ success: false, error: "Access Token missing" }, 401);

      // Get Prisma Client
      const prisma = getPrisma(c);

      // Verify the token
      const payload = await verify(token1, c.env.JWT_SECRET) as { userId: string };
      const userId = payload?.userId;

      if (!userId) return c.json({ success: false, error: "Unauthorized" }, 401);

      // Ensure user exists
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return c.json({ success: false, error: "User not found" }, 404);

      // Fetch all blogs for the user
      const userWithBlogs = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          blogs: {
            orderBy: { createdAt: 'desc' },
            select : {
              title : true,
              id : true,
              tags : {
                select : {
                  name : true,
                }
              },
              published : true,
              createdAt : true,
              upvotes : true,
            },
          },
        },
      });

      return c.json({ success: true, blogs: userWithBlogs?.blogs});

    }
    catch (err) {
      console.error("Error in /my-blogs:", err);
      return c.json(
        { success: false, error: "Internal server error while fetching blogs" },
        500
      );
    }
});



//POST update profile
userRouter.post('/update-profile', async (c) => {
  try {
    const token1 = getCookie(c, "accessToken");
    const token2 = getCookie(c, "refreshToken");

    if(!token2)
      return c.json({success : false, error : "Not authenticated"}, 403);

    if (!token1)
      return c.json({ success: false, error: "Access Token missing" }, 401);

    const decoded = await verify(token1, c.env.JWT_SECRET) as { userId: string };

    const prisma = getPrisma(c);
    const { id, name, bio } = await c.req.json();
    const userId = id;

    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    // Character limits
    if (name && name.length > 30)
      return c.json({ error: "Name cannot exceed 30 characters" }, 400);
    if (bio && bio.length > 200)
      return c.json({ error: "Bio cannot exceed 200 characters" }, 400);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return c.json({ error: "User not found" }, 404);

    const now = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    let shouldReset = false;

    if (!user.lastUpdateDate || user.lastUpdateDate < yesterday) {
      shouldReset = true;
    }
    else if (user.updatedCount >= 2) {
      return c.json({ error: "Profile can only be updated twice per day" }, 429);
    }

    const newUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        updatedCount: shouldReset ? 1 : user.updatedCount + 1,
        lastUpdateDate: now
      },
      select: { id: true, email: true, name: true, bio : true },
    });

    return c.json({ success: true, data : newUser, message: "Profile updated successfully" });

  }
  catch (err) {
    console.error(err);
    return c.json(
      { success: false, error: "Internal server error during profile update" },
      500
    );
  }
});


//POST /user details
userRouter.post("/details", async (c) => {
  try {
    const token1 = getCookie(c, "accessToken");
    const token2 = getCookie(c, "refreshToken");

    if (!token2)
      return c.json({ success: false, error: "Not authenticated" }, 403);

    if (!token1)
      return c.json({ success: false, error: "Access Token missing" }, 401);

    const { email } = await c.req.json();
    const prisma = getPrisma(c);
    let viewerId;

    // Verify viewer's identity
    try {
      const decoded = await verify(token1, c.env.JWT_SECRET) as { userId: string };
      viewerId = decoded.userId;
    }
    catch (err) {
      console.error("Invalid or expired token:", err);
      return c.json({ error: "Unauthorized" }, 401);
    }



    // Fetch user being viewed (with blogs)
    const userWithBlogs = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        imageLink: true,
        createdAt: true,
        profileViews: true,
        blogs: {
          orderBy: { createdAt: "desc" },
          select: {
            title: true,
            id: true,
            tags: { select: { name: true } },
            published: true,
            createdAt: true,
            upvotes: true,
          },
        },
      },
    });

    if (!userWithBlogs)
      return c.json({ success: false, error: "User not found" }, 404);

    // Increment profile view count only if viewer != profile owner
    console.log("viewerd id is ", viewerId)
    console.log("useriwhtblogs id is ", userWithBlogs.id)

    if (viewerId !== userWithBlogs.id) {
      const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
      const cutoff = new Date(Date.now() - COOLDOWN_MS);

      const recentView = await prisma.profileView.findFirst({
        where: {
          viewerId,
          viewedUserId: userWithBlogs.id,
          viewedAt: { gte: cutoff },
        },
      });

      if (!recentView) {
        await prisma.$transaction([
          prisma.profileView.create({
            data: { viewerId, viewedUserId: userWithBlogs.id },
          }),
          prisma.user.update({
            where: { id: userWithBlogs.id },
            data: { profileViews: { increment: 1 } },
          }),
        ]);

        // Update the in-memory object so response shows latest count
        userWithBlogs.profileViews += 1;
      }
    }

    console.log("data is ", userWithBlogs);

    return c.json({ success: true, data: userWithBlogs });
  } catch (err) {
    console.error("Error in user/details:", err);
    return c.json(
      { success: false, error: "Internal server error" },
      500
    );
  }
});


// POST /logout
userRouter.get("/logout", async (c) => {
  deleteCookie(c, "accessToken");
  deleteCookie(c, "refreshToken");
  return c.json({ success: true, message: "Logged out successfully" });
});



// Paste inside the same file where userRouter is defined

userRouter.delete("/delete", async (c) => {
  try {
    // 1) Read cookies
    const token1 = getCookie(c, "accessToken");
    const token2 = getCookie(c, "refreshToken");

    if (!token2) return c.json({ success: false, error: "Not authenticated" }, 403);
    if (!token1) return c.json({ success: false, error: "Access Token missing" }, 401);

    // 2) Verify tokens (try access first; if expired/invalid try refresh)
    let userId: string | undefined;
    try {
      const payload = (await verify(token1, c.env.JWT_SECRET)) as any;
      userId = payload?.userId ?? payload?.id;
    } catch (err) {
      try {
        const payload2 = (await verify(token2, c.env.JWT_SECRET)) as any;
        userId = payload2?.userId ?? payload2?.id;
      } catch {
        return c.json({ success: false, error: "Invalid or expired tokens" }, 401);
      }
    }
    if (!userId) return c.json({ success: false, error: "Invalid token payload" }, 401);

    const prisma = getPrisma(c);

    // 3) Fetch user with authored blogs and upvotedBlogs
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        imageLink: true,
        blogs: { select: { id: true, imageLink: true } }, // authored
        upvotedBlogs: { select: { id: true } }, // blogs this user upvoted
      },
    });

    if (!user) return c.json({ success: false, error: "User not found" }, 404);

    const authoredBlogIds = user.blogs.map((b) => b.id);
    const authoredBlogImageLinks = user.blogs.map((b) => b.imageLink).filter(Boolean) as string[];
    const userImageLink = user.imageLink;
    const upvotedBlogIds = user.upvotedBlogs.map((b) => b.id);
    

    // 5) Minimal transaction: delete authored blogs, profileView rows, user, remove orphan tags
    await prisma.$transaction([
      authoredBlogIds.length > 0
        ? prisma.blog.deleteMany({ where: { authorId: userId } })
        : Promise.resolve(),
      prisma.profileView.deleteMany({ where: { OR: [{ viewerId: userId }, { viewedUserId: userId }] } }),
      prisma.user.delete({ where: { id: userId } }),
      prisma.tag.deleteMany({ where: { blogs: { none: {} } } }),
    ]);

    // --- recompute upvotes (replace existing block) ---
    const recomputeIds = upvotedBlogIds.filter(id => !authoredBlogIds.includes(id));

    if (recomputeIds.length > 0) {
      await Promise.all(
        recomputeIds.map(async (bid) => {
          try {
            // get authoritative count of upvotedBy quickly
            const freshCount = await prisma.blog.findUnique({
              where: { id: bid },
              select: { _count: { select: { upvotedBy: true } } },
            });

            // if blog was deleted, freshCount will be null — skip
            if (!freshCount) return;

            const count = freshCount._count.upvotedBy ?? 0;

            // update the upvotes field to the authoritative count
            await prisma.blog.update({
              where: { id: bid },
              data: { upvotes: count < 0 ? 0 : count },
            });
          } catch (e: any) {
            // ignore "record not found" errors (P2025) which can happen if blog
            // was deleted between checks; log others
            if (e?.code === "P2025") {
              // silently skip, expected when blog removed
              return;
            }
            console.error(`Recompute upvotes failed for blog ${bid}:`, e);
          }
        })
      );
    }


    // 7) Best-effort: delete images from Cloudinary (outside DB transaction)
    const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = c.env.CLOUDINARY_API_KEY;
    const apiSecret = c.env.CLOUDINARY_API_SECRET;

    await Promise.all(
      authoredBlogImageLinks.map(async (imgUrl) => {
        try {
          const publicId = extractCloudinaryPublicId(imgUrl);
          if (!publicId) return;
          const timestamp = Math.floor(Date.now() / 1000).toString();
          const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
          const signature = await sha1(stringToSign);
          const form = new URLSearchParams();
          form.set("public_id", publicId);
          form.set("api_key", apiKey);
          form.set("timestamp", timestamp);
          form.set("signature", signature || "");
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: "POST",
            body: form,
          });
          if (!res.ok) {
            console.error("Cloudinary delete failed for", imgUrl, "->", await res.text());
          }
        } catch (e) {
          console.error("Cloudinary blog image deletion error", e);
        }
      })
    );

    // delete user profile image
    if (userImageLink) {
      try {
        const publicId = extractCloudinaryPublicId(userImageLink);
        if (publicId) {
          const timestamp = Math.floor(Date.now() / 1000).toString();
          const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
          const signature = await sha1(stringToSign);
          const form = new URLSearchParams();
          form.set("public_id", publicId);
          form.set("api_key", apiKey);
          form.set("timestamp", timestamp);
          form.set("signature", signature || "");
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: "POST",
            body: form,
          });
          if (!res.ok) {
            console.error("Cloudinary delete failed for user image", userImageLink, "->", await res.text());
          }
        }
      } catch (e) {
        console.error("Cloudinary user image deletion error", e);
      }
    }

    // 8) Clear auth cookies (optional)
    try {
      deleteCookie(c, "accessToken");
      deleteCookie(c, "refreshToken");
    } catch {}

    return c.json({ success: true, message: "User account and related data deleted" }, 200);
  } catch (err) {
    console.error("Error deleting account:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});



export default userRouter;
