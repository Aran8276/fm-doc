import { source } from "@/lib/source";
import { createSearchAPI } from "fumadocs-core/search/server";

export const revalidate = false;

export const { GET } = createSearchAPI("advanced", {
  language: "english",
  indexes: (await source.getPages()).map((page) => ({
    title: page.structuredData.headings[0].content,
    url: page.url,
    id: page.url,
    structuredData: page.structuredData,
  })),
});
