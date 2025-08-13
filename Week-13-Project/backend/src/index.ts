import { Hono } from 'hono'
import Env from '../types/env'
import userRouter from '../routes/user'
import blogRouter from '../routes/blog'
import { cors } from 'hono/cors'


const app = new Hono<Env>() // 👈 Tell Hono about your environment variables

app.use('*', cors({
  origin: ['http://localhost:5173',
    "https://harkirat-lectures.vercel.app"
  ],
  credentials: true,
}))

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);


app.get("/", (c) => {
    return c.json("hello world")
  
})

export default app
