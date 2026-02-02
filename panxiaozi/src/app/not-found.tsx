import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-foreground animate-bounce">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-muted-foreground mt-4">
          页面未找到
        </h2>
        <p className="text-muted-foreground mt-2 mb-8">
          抱歉，您访问的页面不存在。
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
