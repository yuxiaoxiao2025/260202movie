"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Category } from "@/lib/db/schema";
interface Props {
  children: React.ReactNode;
  categories: Category[];
}

export default function CollapsibleWrapper({ children, categories }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  // 获取当前分类名称
  const getCurrentCategoryName = () => {
    if (!currentCategory) return "分类筛选";
    const category = categories.find((c) => c.key === currentCategory);
    return category ? category.name : "分类筛选";
  };

  // URL 参数变化时收起侧边栏
  useEffect(() => {
    setIsExpanded(false);
  }, [searchParams]);

  return (
    <div className="w-full">
      <button
        className="w-full flex items-center justify-between p-3 bg-muted rounded-lg md:hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{getCurrentCategoryName()}</span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div className={`mt-2 ${isExpanded ? "block" : "hidden"} md:block`}>
        {children}
      </div>
    </div>
  );
}
