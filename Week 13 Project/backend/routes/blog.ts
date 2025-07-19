import { Hono } from "hono"
import Env from "../types/env"
import { Variable } from "../types/variables";
import { verify } from "hono/jwt";

type AppContext = {
    Bindings: Env['Bindings'],
    Variables: Variable
}

const blogRouter = new Hono<AppContext>();


blogRouter.use("/*", async(c , next) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Missing or invalid Authorization header' }, 401)
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = await verify(token, c.env.JWT_SECRET) as { userId: string } // 🔐 Replace with your secret
        // ✅ Set userId (or entire decoded payload) in contex t
        c.set('userId', decoded.userId)
        await next(); 
    }
    catch (err) {
        return c.json({ error: 'Invalid or expired token' }, 403)
    }
})


blogRouter.post("/", (c) => {
    return c.json("hello world")
})

blogRouter.get("/api/v1/blog/:id", (c) => {
    return c.json("hello world")
})

//add pagination
blogRouter.post("/bulk", (c) => {
    return c.json("hello world")

})

export default blogRouter;