import type { Context } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


// ✅ Define helper at top
export default function getPrisma(c : Context) {
    return new PrismaClient({
      datasourceUrl: c.env.ACCELERATE_URL,
    }).$extends(withAccelerate());
}
