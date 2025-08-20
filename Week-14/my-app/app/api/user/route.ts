import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const client = new PrismaClient();

export async function POST(req: NextRequest) { 
  const body = await req.json();
  console.log("body is ", body);

  await client.user.create({
    data: {
      username: body.name,
      password: body.password,
    },
  });

  return Response.json({
    message: "signed up successfully completed",
  });
}

