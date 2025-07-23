import { Hono } from "hono"
import Env from "../types/env"
import { Variable } from "../types/variables";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@mukul1316/common";
import { treeifyError } from "zod";
import getPrisma from "../services/client";
import { getCookie } from "hono/cookie";

type AppContext = {
    Bindings: Env['Bindings'],
    Variables: Variable
}

const blogRouter = new Hono<AppContext>();

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
blogRouter.post("/", async (c) => {
    try {
        const body = await c.req.json();
        const result = createBlogInput.safeParse(body);

        if (!result.success) {
            const errorTree = treeifyError(result.error);
            return c.json({ success: false, error: errorTree }, 400);
        }

        const authorId = c.get("userId");
        const prisma = getPrisma(c);

        const blog = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId,
            }
        });

        return c.json({ message: "Blog created successfully" }, 200);
    }
    catch (err) {
        console.error(err);
        return c.json({ error: "Internal server error" }, 500);
    }
});

// PUT: Update blog
blogRouter.put("/", async (c) => {
    try {
        const body = await c.req.json();
        const result = updateBlogInput.safeParse(body);

        if (!result.success) {
            const errorTree = treeifyError(result.error);
            return c.json({ success: false, error: errorTree }, 400);
        }

        const prisma = getPrisma(c);
        const userId = c.get("userId"); 
        
        const blog = await prisma.blog.findUnique({
            where: { id: body.id },
        });

        if (!blog) {
            return c.json({ message: "No blog exists with the given ID" }, 404);
        }

        if (blog.authorId !== userId) {
            return c.json({ message: "You are not authorized to update this blog" }, 403);
        }

        const updatedBlog = await prisma.blog.update({
            where: { id: body.id },
            data: {
                title: body.title,
                content: body.content,
            },
        });

        return c.json({ message: "Blog updated successfully", blog: updatedBlog }, 200);
    }
    catch (err) {
        console.error(err);
        return c.json({ error: "Internal server error" }, 500);
    }
});


// GET: Get all blogs, pagination remaining
blogRouter.get('/bulk', async (c) => {
    try {
        const prisma = getPrisma(c);
        const blogs = await prisma.blog.findMany({
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return c.json({ blogs }, 200);
    }
    catch (err) {
        console.error(err);
        return c.json({ error: "Failed to fetch blogs" }, 500);
    }
});

// GET: Get blog by ID
blogRouter.get('/:id', async (c) => {
    try {
        const id = c.req.param("id");
        const prisma = getPrisma(c);

        const blog = await prisma.blog.findFirst({
            where: { id: id },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!blog) {
            return c.json({ message: "Blog not found" }, 404);
        }

        return c.json({ blog }, 200);
    }
    catch (e) {
        console.error(e);
        return c.json({ message: "Error while fetching blog post" }, 500);
    }
});

export default blogRouter;
