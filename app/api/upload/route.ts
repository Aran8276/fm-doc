import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: "No file provided" });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ success: false, error: "File is not an image" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "public", "uploads");

  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error("Error creating upload directory:", error);
    return NextResponse.json({
      success: false,
      error: "Could not create upload directory",
    });
  }

  const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
  const path = join(uploadDir, filename);

  try {
    await writeFile(path, buffer);
    const publicPath = `/uploads/${filename}`;
    return NextResponse.json({ success: true, path: publicPath });
  } catch (error) {
    console.error("Error writing file:", error);
    return NextResponse.json({
      success: false,
      error: "Could not write file to disk",
    });
  }
}
