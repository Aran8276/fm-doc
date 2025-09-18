import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { defaultLinks, defaultTitle } from "./layout.shared";
import { Session } from "next-auth";

export function editorBaseOptions(session: Session): BaseLayoutProps {
  return {
    nav: {
      title: defaultTitle,
    },
    links: [
      ...defaultLinks,
      {
        type: "main",
        text: "Editor Materi",
        url: "/editor-materials",
      },
      {
        type: "main",
        text: "Editor Dokumentasi",
        url: "/editor-docs",
      },
      {
        type: "custom",
        secondary: true,
        children: <div className="px-3">Halo {session?.user?.name} 👋</div>,
      },
      {
        type: "button",
        secondary: true,
        text: "Keluar",
        url: "/api/auth/signout",
      },
    ],
  };
}
