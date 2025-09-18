import "./globals.css";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { baseOptions } from "@/lib/layout.shared";
import { editorBaseOptions } from "@/lib/editorLayout.shared";
import { RootProvider } from "fumadocs-ui/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collaborative Editor",
  description: "Real-time collaborative text editor",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootProvider>
          <HomeLayout
            {...(session ? editorBaseOptions(session) : baseOptions())}
          >
            <main className="">{children}</main>
          </HomeLayout>
        </RootProvider>
      </body>
    </html>
  );
}
