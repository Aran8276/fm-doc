import { PageTree } from "fumadocs-core/server";
import prisma from "@/src/lib/prisma";
import type { StructuredData } from "fumadocs-core/mdx-plugins";

export async function getPageTree(materialId: string): Promise<PageTree.Root> {
  const documents = await prisma.document.findMany({
    where: {
      materialId,
    },
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
      url: `/docs/${materialId}/${doc.id}`,
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

async function getPages(): Promise<
  { url: string; structuredData: StructuredData }[]
> {
  const documents = await prisma.document.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      materialId: true,
    },
  });

  return documents.map((doc) => ({
    url: `/docs/${doc.materialId}/${doc.id}`,
    structuredData: {
      headings: [
        {
          id: "title",
          content: doc.title,
        },
      ],
      contents: [
        {
          heading: doc.title,
          content: doc.content || "",
        },
      ],
    },
  }));
}

export const source = {
  getPages,
};
