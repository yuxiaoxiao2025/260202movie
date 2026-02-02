import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  // 获取路径
  const path = request.nextUrl.pathname;

  // 检查是否是admin路由
  const isAdminRoute = path.startsWith("/admin");

  // 获取token
  const token = request.cookies.get("admin-token")?.value;

  // 如果是登录页面，且有token，尝试验证并重定向到管理后台
  if (path === "/login" && token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "your-secret-key",
      );

      await jwtVerify(token, secret);
      // token有效，重定向到管理后台
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } catch (error) {
      // token无效，继续访问登录页面
      return NextResponse.next();
    }
  }

  // 如果是登录页面但没有token，不需要验证
  if (path === "/login") {
    return NextResponse.next();
  }

  // 如果是admin路由，需要验证token
  if (isAdminRoute) {
    // 如果没有token，重定向到登录页面
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // 使用 jose 验证 token
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "your-secret-key",
      );

      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      console.log(error);
      // token无效，重定向到登录页面
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// 配置需要中间件处理的路径
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
