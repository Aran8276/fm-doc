import "./globals.css";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { baseOptions } from "@/lib/layout.shared";
import { editorBaseOptions } from "@/lib/editorLayout.shared";
import { RootProvider } from "fumadocs-ui/provider";
import NextTopLoader from "nextjs-toploader";
import { adminBaseOptions } from "@/lib/adminLayout.shared";

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

  console.log(session?.user?.role);
  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootProvider>
          <HomeLayout
            {...(session?.user?.role === "ADMIN"
              ? adminBaseOptions(session)
              : session?.user?.role === "EDITOR"
              ? editorBaseOptions(session)
              : baseOptions(session))}
          >
            <NextTopLoader />
            <main>{children}</main>
          </HomeLayout>
        </RootProvider>
      </body>
    </html>
  );
}
