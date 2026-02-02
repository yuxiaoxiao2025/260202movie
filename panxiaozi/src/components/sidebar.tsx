import { getCategoryList } from "@/lib/db/queries/category";
import CategoryButton from "./category-button";
import { Suspense } from "react";
import CollapsibleWrapper from "./collapsible-wrapper";

export default async function Sidebar() {
  const categories = await getCategoryList();

  return (
    <CollapsibleWrapper categories={categories}>
      <div className="border rounded-lg p-2 text-sm">
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryButton category={category} />
            </li>
          ))}
        </ul>
      </div>
    </CollapsibleWrapper>
  );
}
