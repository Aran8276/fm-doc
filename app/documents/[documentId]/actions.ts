"use server";

import { compileMDX } from "next-mdx-remote/rsc";

export async function compileMdxFromServer(source: string) {
  try {
    const { content } = await compileMDX({
      source: source,
      options: { parseFrontmatter: false },
    });
    return content;
  } catch (error) {
    console.error("Error compiling MDX:", error);
    if (error instanceof Error) {
      return `Terjadi kesalahan dalam meng-compile MDX: ${error.toString()}`;
    }
  }
}
