import type { Metadata } from "next";
import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { TitleProvider } from "@/contexts/title-context";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: `${process.env.SITE_NAME} - 高质量网盘资源搜索引擎`,
  description: "高质量网盘资源搜索引擎",
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 验证用户是否已登录
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <TitleProvider defaultTitle="管理后台">
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </TitleProvider>
    </SidebarProvider>
  );
}
