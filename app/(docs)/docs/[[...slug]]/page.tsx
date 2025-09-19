import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getDocument } from "@/lib/source";
import { compileMDX } from "@fumadocs/mdx-remote";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;

export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const page = await getDocument(params.slug?.[1]);

  if (!page || !page.content) {
    notFound();
  }

  const compiled = await compileMDX({
    source: page.content,
  });

  const MdxContent = compiled.body;

  return (
    <DocsPage toc={compiled.toc}>
      <DocsBody>
        <h1>{page.title}</h1>
        <MdxContent components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
