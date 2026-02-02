import SearchResults from "@/components/search-results";
import Sidebar from "@/components/sidebar";
import Pagination from "@/components/pagination";
import SearchForm from "@/components/search-form";
import { getResourcePageList } from "@/lib/db/queries/resource";
import type { Metadata } from "next";
import { getCategoryByKey } from "@/lib/db/queries/category";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q: string; category: string }>;
}): Promise<Metadata> {
  const query = (await searchParams).q;
  const category = (await searchParams).category;

  if (query) {
    return {
      title: `${query}在线网盘资源搜索下载 - ${process.env.SITE_NAME}`,
      description: `${process.env.SITE_NAME}是一个一站式网盘资源搜索引擎，支持夸克网盘、百度网盘、阿里云盘等多平台，快速精准搜索，一键直达`,
    };
  }

  if (category) {
    const categoryInfo = await getCategoryByKey(category);
    return {
      title: `${categoryInfo.name}在线网盘资源搜索下载 - ${process.env.SITE_NAME}`,
      description: `${process.env.SITE_NAME}是一个一站式网盘资源搜索引擎，支持夸克网盘、百度网盘、阿里云盘等多平台，快速精准搜索，一键直达`,
    };
  }

  return {
    title: `在线网盘资源搜索下载 - ${process.env.SITE_NAME}`,
    description: `${process.env.SITE_NAME}是一个一站式网盘资源搜索引擎，支持夸克网盘、百度网盘、阿里云盘等多平台，快速精准搜索，一键直达`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string; page: string; category: string }>;
}) {
  // 获取搜索参数
  const param = await searchParams;
  const query = param.q;
  const p = param.page;
  const category = param.category;
  const page = Number(p) || 1;
  const pageSize = 10;

  const data = await getResourcePageList(page, pageSize, query, category);
  let totalPages = data.total / pageSize;
  if (data.total > 0) {
    if (!Number.isInteger(totalPages)) {
      totalPages = Math.ceil(totalPages);
    } else {
      totalPages = Number.parseInt(`${totalPages}`, 10);
    }
  }

  return (
    <div className="container mx-auto p-4 text-base">
      <h1 className="flex justify-center text-[#2563eb] mb-2 text-xl">
        {query}在线网盘资源搜索下载 - {process.env.SITE_NAME}
      </h1>
      {/* 搜索框 - 与首页样式保持一致 */}
      <div className="mb-8">
        <SearchForm initialQuery={query} />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* 侧边栏 */}
        <div className="md:sticky md:top-20 md:self-start h-fit">
          <Sidebar />
        </div>

        {/* 搜索结果和分页 */}
        <div className="w-full md:w-3/4">
          <SearchResults list={data.list} />
          {totalPages > 0 && (
            <div className="mt-8">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
