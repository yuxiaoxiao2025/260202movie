import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { findUserByUsername } from "@/lib/db/queries/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = new Hono();

const userSchema = z.object({
  username: z.string(),
  password: z.string(),
});

app.post("/login", zValidator("json", userSchema), async (c) => {
  const { username, password } = c.req.valid("json");
  const user = await findUserByUsername(username);
  if (!user) {
    return c.json({ error: "用户或密码错误" }, 401);
  }
  // 验证密码
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return c.json({ error: "用户或密码错误" }, 401);
  }
  // 登录成功写入cookie
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || "secret",
  );
  // 设置cookie，添加24小时过期时间
  const maxAge = 24 * 60 * 60; // 24小时（单位：秒）
  c.res.headers.set(
    "Set-Cookie",
    `admin-token=${token}; HttpOnly; Path=/; Max-Age=${maxAge};`,
  );
  return c.json({ id: user.id, username: user.username });
});

export default app;
