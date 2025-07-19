import { Hono } from "hono";
import getPrisma from "../services/client";
import {sign} from "hono/jwt"
import Env from "../types/env";


const userRouter = new Hono<Env>() // 👈 Tell Hono about your environment variables

userRouter.post('/api/v1/signup', async (c) => {
    const prisma = getPrisma(c);
    const body = await c.req.json();

    const user = await prisma.user.create({
        data : {
          name : body.name,
          email : body.email,
          password : body.password,
        }
    })
    
    const token = await sign({ id : user.id}, c.env.JWT_SECRET)
    return c.json({
        message : "user signup successfully",
    }, 200)
})

userRouter.post("/api/v1/signin", async (c) => {
    const prisma = getPrisma(c);
    const body = await c.req.json();
    const user = await prisma.user.findUnique({
        where : {
          email : body.email,
          password : body.password,
        }
    })
    
    if(!user){
        return c.json({error : "user not found"}, 403);
    }

    const jwt = await sign({id : user.id}, c.env.JWT_SECRET);
    return c.json({ jwt }, 200);
    
})

export default userRouter;