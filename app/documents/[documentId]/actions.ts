/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { compileMDX } from "@fumadocs/mdx-remote";
import { getMDXComponents as getClientMDXComponents } from "@/app/(docs)/docs/[[...slug]]/page";
import { createElement } from "react";
import type { MDXComponents } from "mdx/types";

function getMDXComponents(): MDXComponents {
  const components = getClientMDXComponents();

  return {
    ...components,
    pre: (props) => {
      const copyButton = createElement(
        "button",
        {
          type: "button",
          className:
            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none p-1 [&_svg]:size-4 hover:text-fd-accent-foreground",
          "aria-label": "Copy Text",
        },
        createElement(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "lucide",
          },
          createElement("rect", {
            width: "8",
            height: "4",
            x: "8",
            y: "2",
            rx: "1",
            ry: "1",
          }),
          createElement("path", {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
          })
        )
      );

      const preElement = createElement("pre", {
        ...props,
        className: `min-w-full w-max *:flex *:flex-col ${
          props.className || ""
        }`.trim(),
      });

      return createElement(
        "figure",
        {
          dir: "ltr",
          className:
            "my-4 bg-fd-card rounded-xl shiki relative border shadow-sm outline-none not-prose overflow-hidden text-sm shiki shiki-themes github-light github-dark",
          style: {
            "--shiki-light": "#24292e",
            "--shiki-dark": "#e1e4e8",
            "--shiki-light-bg": "#fff",
            "--shiki-dark-bg": "#24292e",
          },
          tabIndex: 0,
        },
        createElement(
          "div",
          {
            className:
              "empty:hidden absolute top-2 right-2 z-2 backdrop-blur-lg rounded-lg text-fd-muted-foreground",
          },
          copyButton
        ),
        createElement(
          "div",
          {
            className:
              "text-[13px] py-3.5 overflow-auto max-h-[600px] fd-scroll-container",
            style: { "--padding-right": "calc(var(--spacing) * 8)" },
          },
          preElement
        )
      );
    },
    img: (props) => {
      return createElement("img", {
        ...props,
        className: `rounded-lg ${props.className || ""}`.trim(),
        loading: "lazy",
        decoding: "async",
        style: { color: "transparent", ...(props.style || {}) },
      } as any);
    },
    a: (props) => createElement("a", props),
  };
}

async function streamToString(stream: ReadableStream): Promise<string> {
  const response = new Response(stream);
  return response.text();
}

export async function compileMdxToServer(source: string) {
  if (typeof source !== "string") {
    return { error: "Invalid source provided" };
  }

  const { renderToStaticMarkup, renderToReadableStream } = await import(
    "react-dom/server"
  );

  try {
    const { body: MdxContent } = await compileMDX({
      source,
    });
    const element = createElement(MdxContent, {
      components: getMDXComponents(),
    });

    const stream = await renderToReadableStream(element);
    const html = await streamToString(stream);
    return { html };
  } catch (error) {
    console.error("Error compiling MDX:", error);
    let errorMessage = "An unknown error occurred while compiling MDX.";
    if (error instanceof Error) {
      errorMessage = `Terjadi kesalahan dalam meng-compile MDX: ${error.message}`;
      if (error.message.includes("is not defined")) {
        errorMessage +=
          "\n\nHint: If you want to display curly braces as text, escape them with a backslash, for example: \\{your text\\}.";
      }
    }

    const ErrorDisplay = createElement(
      "div",
      { className: "text-red-500 p-4 border border-red-500 rounded-md" },
      createElement("pre", { style: { whiteSpace: "pre-wrap" } }, errorMessage)
    );

    const html = renderToStaticMarkup(ErrorDisplay);
    return { html, error: true };
  }
}