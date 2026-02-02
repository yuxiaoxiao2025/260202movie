import { Hero } from "@/components/hero";
import { ResourceList } from "@/components/resource";

export const revalidate = 60;
// export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <ResourceList />
    </>
  );
}
