"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function StatusBarTheme() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // 动态设置状态栏样式
    const setStatusBarStyle = () => {
      const isDark = resolvedTheme === "dark";

      // 设置苹果设备状态栏样式
      const statusBarMeta = document.querySelector(
        'meta[name="apple-mobile-web-app-status-bar-style"]',
      );
      if (statusBarMeta) {
        statusBarMeta.setAttribute(
          "content",
          isDark ? "black-translucent" : "light-content",
        );
      }

      // 设置主题颜色
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", isDark ? "#1a1a1a" : "#ffffff");
      }
    };

    // 延迟执行以确保主题已加载
    const timer = setTimeout(setStatusBarStyle, 100);

    return () => clearTimeout(timer);
  }, [resolvedTheme]);

  return null;
}
