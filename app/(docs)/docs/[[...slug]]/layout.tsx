import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getPageTree } from "@/lib/source";
import prisma from "@/src/lib/prisma";
import Image from "next/image";

export default async function Layout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { slug?: string[] };
}) {
  const pageTree = await getPageTree((await params.slug?.[0]) || "");

  const tabs = await prisma.material.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(tabs);

  return (
    <DocsLayout
      disableThemeSwitch
      sidebar={{
        tabs: [
          ...tabs?.map((item) => {
            return {
              title: item.name,
              description: "Materi Peminatan",
              url: `/docs/${item.id}/${params.slug?.[1]}`,
              icon: (
                <Image
                  src={item.imageUrl}
                  width={32}
                  height={32}
                  className="h-full w-full rounded-sm self-center"
                  alt={item.name}
                />
              ),
            };
          }),
        ],
      }}
      tree={pageTree}
    >
      <main className="container mx-auto">{children}</main>
    </DocsLayout>
  );
}
