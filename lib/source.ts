import { PageTree } from "fumadocs-core/server";
import prisma from "@/src/lib/prisma";

export async function getPageTree(): Promise<PageTree.Root> {
  const documents = await prisma.document.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    name: "Documentation",
    children: documents.map((doc) => ({
      type: "page",
      name: doc.title,
      url: `/docs/${doc.id}`,
    })),
  };
}

export async function getDocument(slug: string | undefined) {
  if (!slug) return null;

  return prisma.document.findUnique({
    where: {
      id: slug,
    },
  });
}
