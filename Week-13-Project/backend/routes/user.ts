import { Hono } from "hono";
import getPrisma from "../services/client";
import { sign, verify } from "hono/jwt";
import Env from "../types/env";
import { signupInput, signinInput } from "@mukul1316/common";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { success, treeifyError } from "zod";

const userRouter = new Hono<Env>();

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
      sameSite: "Strict",
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
    return c.json({ success: false, error: "Not authenticated" }, 401);

  try {
    const decoded = await verify(token1, c.env.JWT_SECRET) as { userId: string };
    const prisma = getPrisma(c);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    });

    return c.json({ success: true, data: user });
  } catch {
    return c.json({ success: false, error: "Invalid token" }, 403);
  }
});

// POST /signup
userRouter.post("/signup", async (c) => {
  try {
    const prisma = getPrisma(c);
    const body = await c.req.json();

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

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    return c.json({
      success: true,
      message: "User signup successful",
      data: { id: user.id, email: user.email, name: user.name },
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
      sameSite: "Strict",
      maxAge: 60 * 15,
    });

    setCookie(c, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return c.json({
      success: true,
      message: "Signin successful",
      data: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: "Internal server error during signin" }, 500);
  }
});

// POST /logout
userRouter.get("/logout", async (c) => {
  deleteCookie(c, "accessToken");
  deleteCookie(c, "refreshToken");
  return c.json({ success: true, message: "Logged out successfully" });
});

export default userRouter;
