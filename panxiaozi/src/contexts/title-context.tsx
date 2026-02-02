"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TitleContextType {
  title: string;
  setTitle: (title: string) => void;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export function TitleProvider({
  children,
  defaultTitle = "管理后台",
}: {
  children: ReactNode;
  defaultTitle?: string;
}) {
  const [title, setTitle] = useState(defaultTitle);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
}

export function useTitle() {
  const context = useContext(TitleContext);
  if (context === undefined) {
    throw new Error("useTitle must be used within a TitleProvider");
  }
  return context;
}

// 用于在页面组件中设置标题的Hook
export function useSetTitle(title: string) {
  const { setTitle } = useTitle();

  React.useEffect(() => {
    setTitle(title);

    // 组件卸载时可以选择是否重置标题
    // return () => setTitle(defaultTitle);
  }, [title, setTitle]);
}
