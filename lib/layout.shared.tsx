import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { Github } from "lucide-react";
import { Session } from "next-auth";

export const defaultTitle = "AranDocs";

export const defaultLinks = (session?: Session | null): LinkItemType[] => {
  return [
    {
      type: "main",
      text: "Materi",
      url: "/",
    },
    ...(session
      ? [
          {
            type: "custom" as const,
            secondary: true,
            children: <div className="px-3">Halo {session?.user?.name} 👋</div>,
          },
          {
            type: "button" as const,
            secondary: true,
            text: "Keluar",
            url: "/api/auth/signout",
          },
        ]
      : []),

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
};

export function baseOptions(session?: Session | null): BaseLayoutProps {
  return {
    nav: {
      title: defaultTitle,
    },
    links: defaultLinks(session),
  };
}
