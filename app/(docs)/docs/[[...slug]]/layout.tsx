// app/(docs)/docs/[[...slug]]/layout.js

import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getPageTree } from "@/lib/source";
import prisma from "@/src/lib/prisma";
import Image from "next/image";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ slug?: string[] | undefined }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params;

  const pageTree = await getPageTree(slug?.[0] || "");

  const tabs = await prisma.material.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <DocsLayout
      disableThemeSwitch
      sidebar={{
        prefetch: false,
        tabs: tabs.map((item) => ({
          title: item.name,
          description: "Materi Peminatan",
          url: `/docs/${item.id}/${slug?.[1] || ""}`,
          icon: (
            <Image
              src={item.imageUrl}
              width={32}
              height={32}
              className="h-full w-full rounded-sm self-center"
              alt={item.name}
            />
          ),
        })),
      }}
      tree={pageTree}
    >
      <main className="container mx-auto">{children}</main>
    </DocsLayout>
  );
}
