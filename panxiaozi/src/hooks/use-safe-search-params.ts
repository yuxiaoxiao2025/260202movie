import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * 安全地使用 useSearchParams hook，避免 Next.js 15 中的 Suspense 要求
 * 在服务端返回空的 URLSearchParams，在客户端返回真实的 searchParams
 */
export const useSafeSearchParams = () => {
  const [mounted, setMounted] = useState(false);

  // 只在客户端调用 useSearchParams
  const searchParams =
    typeof window !== "undefined" ? useSearchParams() : new URLSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 服务端或未挂载时返回空的 URLSearchParams
  if (!mounted) {
    return new URLSearchParams();
  }

  return searchParams;
};
