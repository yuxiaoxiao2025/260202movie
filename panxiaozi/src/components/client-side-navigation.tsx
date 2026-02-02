"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ClientSideNavigationProps {
  categoryId: string;
  title: string;
}

export function ClientSideNavigation({
  categoryId,
  title,
}: ClientSideNavigationProps): JSX.Element {
  const [isActive, setIsActive] = useState(false);

  // 检查当前URL的hash是否匹配当前分类
  useEffect(() => {
    const checkIfActive = () => {
      const hash = window.location.hash.replace("#", "");
      setIsActive(hash === categoryId || (!hash && categoryId === "all"));
    };

    // 初始检查
    checkIfActive();

    // 监听hash变化
    window.addEventListener("hashchange", checkIfActive);

    return () => {
      window.removeEventListener("hashchange", checkIfActive);
    };
  }, [categoryId]);

  const handleClick = () => {
    // 更新URL hash
    window.location.hash = categoryId;

    // 滚动到对应的锚点
    const element = document.getElementById(categoryId);
    if (element) {
      // 如果是"全部"分类，滚动到资源容器顶部
      if (categoryId === "all") {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start",
        isActive && "bg-blue-50 text-blue-600 font-medium",
      )}
      onClick={handleClick}
    >
      {title}
    </Button>
  );
}
