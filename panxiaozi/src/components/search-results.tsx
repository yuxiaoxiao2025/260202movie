import type { Resource } from "@/lib/db/schema";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { formatDate } from "@/utils";
import { getCategoryList } from "@/lib/db/queries/category";
import Image from "next/image";

interface SearchResultsProps {
  list: Resource[];
}

export default async function SearchResults({ list }: SearchResultsProps) {
  const categories = await getCategoryList();
  const categoryMap = new Map(
    categories.map((category) => [category.key, category.name]),
  );

  return (
    <div className="space-y-2 text-base">
      {list.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">没有找到相关结果</p>
        </div>
      ) : (
        list.map((result) => (
          <div
            key={result.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow flex gap-4"
          >
            {result.cover && (
              <div className="flex-shrink-0 self-start">
                <Image
                  src={result.cover}
                  alt={result.title}
                  width={160}
                  height={100}
                  className="object-cover rounded-md w-[140px] h-[200px]"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link href={`/resource/${result.pinyin}`} className="block">
                <div className="flex items-center gap-2 flex-nowrap overflow-hidden">
                  <Badge
                    variant="outline"
                    className="text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20 shrink-0"
                  >
                    {categoryMap.get(result.categoryKey)}
                  </Badge>
                  <h2 className="hover:underline truncate min-w-0 flex-1">
                    {result.title}
                  </h2>
                </div>
                <p className="mt-2 text-muted-foreground text-sm break-words line-clamp-7 sm:line-clamp-none">
                  {result.desc}
                </p>
                <p className="mt-2 text-muted-foreground text-sm">
                  更新时间：
                  {result.updatedAt ? formatDate(result.updatedAt) : "未知"}
                </p>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
