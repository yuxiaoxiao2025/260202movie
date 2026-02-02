import { Logo } from "./logo";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import SearchForm from "./search-form";
import { getHotResource, getResourceCount } from "@/lib/db/queries/resource";

export async function Hero() {
  const hotResources = await getHotResource();
  const count = await getResourceCount();
  return (
    <div className="py-12 bg-blue-50 dark:bg-blue-900/10">
      <div className="container grid grid-cols-1 md:grid-cols-1 gap-8 items-center flex-col">
        <div className="space-y-6">
          <div className="flex items-center gap-2 justify-center">
            <Logo size={28} />
            <h1 className="text-2xl font-bold text-blue-500">
              {process.env.SITE_NAME}
            </h1>
            <span className="text-gray-700 dark:text-muted-foreground">
              已收录
            </span>
            <span className="text-blue-500 font-bold">{count}</span>
            <span className="text-gray-700 dark:text-muted-foreground">
              个高质量资源
            </span>
          </div>
          <SearchForm path="/resource" />
        </div>
        <div>
          <Card className="h-full">
            <CardContent className="p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">热门搜索</h2>
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                {hotResources.map((item, index) => (
                  <li key={item}>
                    <Link
                      href={`/resource?q=${item}`}
                      title={item}
                      className="flex items-center gap-2 group"
                    >
                      <span className="text-xs block text-orange-500 font-bold min-w-5">
                        {index + 1}
                      </span>
                      <span className="text-sm group-hover:text-blue-500 text-gray-700 dark:text-muted-foreground line-clamp-1">
                        {item}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
