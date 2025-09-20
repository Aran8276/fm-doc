import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { defaultLinks, defaultTitle } from "./layout.shared";
import { Session } from "next-auth";

export const defaultEditorLinks = (session: Session): LinkItemType[] => {
  return [
    ...defaultLinks(session),
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
  ];
};

export function editorBaseOptions(session: Session): BaseLayoutProps {
  return {
    nav: {
      title: defaultTitle,
    },
    links: defaultEditorLinks(session),
  };
}
