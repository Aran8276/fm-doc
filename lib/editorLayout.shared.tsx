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
        type: "menu",
        text: "Editor",
        items: [
          {
            type: "main",
            text: "Editor Minat",
            description:
              "Datalist untuk membuat, menghapus, atau mengedit peminatan materi.",
            url: "/editor-materials",
          },
          {
            type: "main",
            text: "Editor Materi",
            description:
              "Datalist untuk membuat, menghapus, atau mengedit materi utama.",
            url: "/editor-docs",
          },
        ],
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
