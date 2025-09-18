import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { defaultLinks } from "./layout.shared";
import { Session } from "next-auth";

export function editorBaseOptions(session: Session): BaseLayoutProps {
  return {
    nav: {
      title: "Dokumentasi Ekskul RPL",
    },
    links: [
      ...defaultLinks,
      {
        type: "main",
        text: "Editor",
        url: "/editor",
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
        url: "/logout",
      },
    ],
  };
}
