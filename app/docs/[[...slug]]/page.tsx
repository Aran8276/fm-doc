import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getDocument } from "@/lib/source";
import { compileMDX } from "next-mdx-remote/rsc";

export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const page = await getDocument(params.slug?.[0]);

  if (!page || !page.content) {
    notFound();
  }

  // Compile the MDX content from the database
  const { content } = await compileMDX({
    source: page.content,
    options: { parseFrontmatter: false }, // Frontmatter is not needed as it's handled by your database
  });

  return (
    <DocsPage>
      <DocsBody>
        <h1>{page.title}</h1>
        {content}
      </DocsBody>
    </DocsPage>
  );
}
