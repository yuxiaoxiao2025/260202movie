import { getResourceCount } from "@/lib/db/queries/resource";
import type { MetadataRoute } from "next";

export const revalidate = 300;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://pan.xiaozi.cc";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const totalResources = await getResourceCount();
  const SITEMAP_SIZE = 50000;
  const numberOfResourceSitemaps = Math.ceil(totalResources / SITEMAP_SIZE);

  // 静态路由
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/main/sitemap.xml`,
    },
  ];

  // 生成 resource sitemap 引用
  const resourceSitemaps: MetadataRoute.Sitemap = Array.from(
    { length: numberOfResourceSitemaps },
    (_, i) => ({
      url: `${BASE_URL}/resource/sitemap/${i + 1}.xml`,
    }),
  );

  return [...staticRoutes, ...resourceSitemaps];
}
