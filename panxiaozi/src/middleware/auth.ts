import { Context, Next } from "hono";
import { jwtVerify } from "jose";
import { getCookie } from "hono/cookie";
import { getCurrentUser, UserSession } from "@/lib/auth";
import { findUserById } from "@/lib/db/queries/user";

// 定义鉴权中间件
export const authMiddleware = async (c: Context, next: Next) => {
  // 从请求头或cookie中获取token
  const token = getCookie(c, "admin-token");

  // 如果没有token，返回401未授权
  if (!token) {
    return c.json(
      {
        success: false,
        message: "未授权访问，请先登录",
      },
      401,
    );
  }

  try {
    // 使用jose验证token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key",
    );

    const { payload } = await jwtVerify(token, secret);
    const userId = (payload as UserSession).id;

    const user = await findUserById(userId);
    if (!user) {
      return c.json(
        {
          success: false,
          message: "用户不存在",
        },
        401,
      );
    }

    // 将用户信息添加到请求上下文中
    c.set("user", user);

    // 继续处理请求
    return next();
  } catch (error) {
    // token无效，返回401未授权
    return c.json(
      {
        success: false,
        message: "无效的令牌或令牌已过期",
      },
      401,
    );
  }
};
