import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";

export const defaultTitle = "AranDocs";

export const defaultLinks: LinkItemType[] = [
  {
    type: "main",
    text: "Dokumentasi",
    url: "/",
  },
  {
    type: "menu",
    text: "Belajar",
    items: [
      {
        text: "Hub Belajar",
        description: "Pilih minat jurusan mu!",
        url: "/",
      },
    ],
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
