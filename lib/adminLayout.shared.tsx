import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Session } from "next-auth";
import { defaultEditorLinks } from "./editorLayout.shared";
import { defaultTitle } from "./layout.shared";

export function adminBaseOptions(session: Session): BaseLayoutProps {
  return {
    nav: {
      title: defaultTitle,
    },
    links: [
      ...defaultEditorLinks(session),
      {
        type: "main",
        text: "Kelola User",
        url: "/manage-user",
      },
    ],
  };
}
