import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";

export const defaultLinks: LinkItemType[] = [
  {
    type: "menu",
    text: "Beranda",
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
      title: "Dokumentasi Ekskul RPL",
    },
    links: defaultLinks,
  };
}
