// ./middleware.ts
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const userRole = token?.role;
    const { pathname } = req.nextUrl;

    if (
      pathname.startsWith("/editor-docs") ||
      pathname.startsWith("/editor-materials")
    ) {
      if (userRole !== "ADMIN" && userRole !== "EDITOR") {
        return new NextResponse("You are not authorized to access this page", {
          status: 403,
        });
      }
    }

    if (pathname.startsWith("/manage-user")) {
      if (userRole !== "ADMIN") {
        return new NextResponse("You are not authorized to access this page", {
          status: 403,
        });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/editor-docs/:path*",
    "/editor-materials/:path*",
    "/manage-user/:path*",
  ],
};
