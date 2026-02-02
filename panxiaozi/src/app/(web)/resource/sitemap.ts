import {
  getResourceCount,
  getResourceRange,
} from "@/lib/db/queries/resource";
import type { MetadataRoute } from "next";

export const revalidate = 300;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://pan.xiaozi.cc";
const SITEMAP_SIZE = 50000; // Google's limit per sitemap 50000

export async function generateSitemaps() {
  const totalResources = await getResourceCount();
  const numberOfSitemaps = Math.ceil(totalResources / SITEMAP_SIZE);

  return Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i + 1 }));
}

export default async function sitemap(props: {
  id: Promise<number>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const start = (id - 1) * SITEMAP_SIZE;
  const end = start + SITEMAP_SIZE;

  // 其他 sitemap 只包含资源路由
  const resources = await getResourceRange(start, end);
  const resourceRoutes = resources.map((resource) => ({
    url: `${BASE_URL}/resource/${resource.pinyin}`,
    lastModified: resource.updatedAt || new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return resourceRoutes;
}
