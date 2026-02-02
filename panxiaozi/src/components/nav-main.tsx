"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  // 改进的路径匹配逻辑
  const isPathActive = (itemPath: string) => {
    // 精确匹配
    if (pathname === itemPath) return true;

    // 对于根路径，只有完全匹配才算
    if (itemPath === "/") return pathname === "/";

    // 对于其他路径，检查是否为子路径，但要确保是完整路径段的匹配
    // 例如 /admin 应该匹配 /admin/dashboard，但不应匹配 /admin-settings
    return pathname.startsWith(itemPath + "/") || pathname === itemPath;
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          // 检查是否有子菜单项
          const hasSubItems = item.items && item.items.length > 0;

          // 检查子菜单项是否有匹配当前路径的
          const hasActiveChild =
            hasSubItems &&
            item.items?.some((subItem) => isPathActive(subItem.url));

          // 检查当前路径是否匹配此菜单项（但如果子菜单被选中，则父菜单不高亮）
          const isActive = isPathActive(item.url) && !hasActiveChild;

          // 如果没有子菜单项，直接渲染为链接
          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={isActive ? "text-blue-500 bg-blue-50" : ""}
                >
                  <Link href={item.url}>
                    {item.icon && (
                      <item.icon className={isActive ? "text-blue-500" : ""} />
                    )}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // 有子菜单项时使用 Collapsible
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive || hasActiveChild}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={isActive ? "text-blue-500 bg-blue-50" : ""}
                  >
                    {item.icon && (
                      <item.icon className={isActive ? "text-blue-500" : ""} />
                    )}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubActive = isPathActive(subItem.url);

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={
                              isSubActive ? "text-blue-500 bg-blue-50" : ""
                            }
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
