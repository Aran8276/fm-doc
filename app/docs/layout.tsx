import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getPageTree } from "@/lib/source";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageTree = await getPageTree();
  return (
    <DocsLayout
      sidebar={{
        tabs: [
          {
            title: "Components",
            description: "Hello World!",
            url: "/docs/cmfp6ukgo0001twlwjcnxahn4",
          },
          {
            title: "sad",
            description: "dads World!",
            url: "/docs/components",
          },
        ],
      }}
      tree={pageTree}
    >
      {children}
    </DocsLayout>
  );
}
