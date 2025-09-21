/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const filename = (await params).slug.join("/");
  const filePath = path.join(process.cwd(), "writable", "uploads", filename);

  try {
    const stats = await fs.stat(filePath);

    if (!stats.isFile()) {
      return new NextResponse(null, { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);

    const headers = new Headers();
    headers.set("Content-Type", getContentType(filename));
    headers.set("Content-Length", stats.size.toString());

    const body = new Uint8Array(fileBuffer);

    return new NextResponse(body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return new NextResponse("File not found", { status: 404 });
    }
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
