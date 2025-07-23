import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import type { Context } from 'hono'

let prisma: ReturnType<typeof createPrisma> | null = null;

function createPrisma(c: Context) {
    return new PrismaClient({
      datasourceUrl: c.env.ACCELERATE_URL,
    }).$extends(withAccelerate());
}

export default function getPrisma(c: Context) {
  if (!prisma) {
    prisma = createPrisma(c);
  }
  return prisma;
}