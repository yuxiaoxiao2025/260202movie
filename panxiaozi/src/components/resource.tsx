import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { ClientSideNavigation } from "./client-side-navigation";
import { getCategoryList } from "@/lib/db/queries/category";
import type { Category, Resource } from "@/lib/db/schema";
import { getHomeResource } from "@/lib/db/queries/resource";
import { ellipsisText, formatDate } from "@/utils";

type ResourcesMap = {
  [categoryId: string]: Resource[];
};

// 生成模拟资源数据 - 服务端函数
function generateServerResources(
  categories: Category[],
  resources: Resource[],
): ResourcesMap {
  const allResources: ResourcesMap = {};
  const resourceMap = new Map<string, Resource[]>();

  for (const item of resources) {
    const existingResources = resourceMap.get(item.categoryKey) || [];
    resourceMap.set(item.categoryKey, [...existingResources, item]);
  }

  for (const category of categories) {
    // 为每个分类获取资源，如果不存在则提供空数组作为默认值
    allResources[category.key] = resourceMap.get(category.key) || [];
  }

  return allResources;
}

export async function ResourceList() {
  // 在服务端生成资源数据
  const categories = await getCategoryList();
  const homeResources = await getHomeResource();

  const resources = generateServerResources(categories, homeResources);

  return (
    <div className="py-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="max-w-32 hidden md:sticky md:top-20 md:block h-fit w-full md:w-32 flex-shrink-0">
            <div className="border rounded-lg p-2">
              <ul className="flex flex-col">
                {categories.map((category) => (
                  <li key={category.id}>
                    {/* 使用客户端组件处理交互 */}
                    <ClientSideNavigation
                      categoryId={category.key}
                      title={category.name}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-1 min-w-0 mx-1" id="resources-container">
            {/* 添加一个隐藏的锚点用于"全部"分类 */}
            <div id="all" className="scroll-mt-20"></div>

            {/* 只渲染非"全部"分类的内容 */}
            {categories
              .filter((category) => category.key !== "all")
              .map((category) => (
                <div
                  key={category.id}
                  id={category.key}
                  className="scroll-mt-20"
                >
                  <div className="mb-6 mt-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold">{category.name}</h2>
                    {resources[category.key]?.length > 12 && (
                      <Link
                        href={`/resource?category=${category.key}`}
                        title={category.name}
                        className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                      >
                        查看更多
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6"></path>
                        </svg>
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10 cursor-pointer">
                    {resources[category.key]?.slice(0, 12).map((resource) => (
                      <Link
                        href={`/resource/${resource.pinyin}`}
                        title={resource.title}
                        key={resource.id}
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                          <CardContent className="p-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-base line-clamp-1">
                                  {ellipsisText(resource.title)}
                                </h3>
                                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 rounded-full">
                                  {resource.diskType}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span>
                                  更新时间:{" "}
                                  {resource.updatedAt
                                    ? formatDate(resource.updatedAt)
                                    : "未知"}
                                </span>
                              </div>

                              <div className="mt-2 flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                  <div className="w-6 h-6 bg-blue-50 dark:bg-blue-950/20 rounded-full flex items-center justify-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-blue-500"
                                    >
                                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                      <polyline points="7 10 12 15 17 10"></polyline>
                                      <line
                                        x1="12"
                                        y1="15"
                                        x2="12"
                                        y2="3"
                                      ></line>
                                    </svg>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    下载
                                  </span>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-7 px-2"
                                >
                                  查看详情
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 在ResourceItem组件中添加链接
interface ResourceItemProps {
  resource: {
    title: string;
    description?: string;
  };
}

export function ResourceItem({ resource }: ResourceItemProps) {
  return (
    <Link
      href={`/resource/${encodeURIComponent(resource.title)}`}
      className="block hover:bg-accent p-4 rounded-lg transition-colors"
    >
      {/* 现有的资源项内容 */}
      <h3 className="font-medium">{resource.title}</h3>
      {resource.description && (
        <p className="text-sm text-muted-foreground">{resource.description}</p>
      )}
    </Link>
  );
}
