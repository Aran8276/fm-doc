import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { Github } from "lucide-react";

export const defaultTitle = "AranDocs";

export const defaultLinks: LinkItemType[] = [
  {
    type: "main",
    text: "Materi",
    url: "/",
  },
  {
    type: "custom",
    children: (
      <li className="list-none m-0 p-0">
        <a
          className="inline-flex items-center gap-1 py-2 pl-1 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary [&amp;_svg]:size-4 text-sm"
          data-active="false"
          data-radix-collection-item=""
          href="https://github.com/Aran8276/fm-doc"
          target="_blank"
        >
          <Github />
          GitHub
        </a>
      </li>
    ),
  },
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: defaultTitle,
    },
    links: defaultLinks,
  };
}
