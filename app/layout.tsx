import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
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
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
        className={inter.className}
      >
        {/* <header className="bg-gray-800 text-white p-4">
          <nav className="container mx-auto flex justify-between">
            <Link href="/" className="font-bold text-xl">
              Collab Editor
            </Link>
            <div>
              {session ? (
                <>
                  <span className="mr-4">Welcome, {session.user?.name}</span>
                  <Link href="/api/auth/signout" className="hover:underline">
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="mr-4 hover:underline">
                    Login
                  </Link>
                  <Link href="/register" className="hover:underline">
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header> */}
        <RootProvider>
          <main className="container mx-auto p-4">{children}</main>
        </RootProvider>
      </body>
    </html>
  );
}
