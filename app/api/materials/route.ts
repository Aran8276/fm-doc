import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { formatSlug } from "@/lib/formatSlug";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.formData();
    const name: string | null = data.get("name") as unknown as string;
    const homeUrl: string | null = data.get("homeUrl") as unknown as string;
    const file: File | null = data.get("imageUrl") as unknown as File;

    if (!name || !homeUrl || !file) {
      return NextResponse.json(
        { message: "Bad Request: Missing required fields" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, Date.now() + "_" + file.name);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${path.basename(filePath)}`;

    const newMaterial = await prisma.material.create({
      data: {
        name,
        slug: formatSlug(name),
        imageUrl,
        homeUrl,
      },
    });

    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, id, homeUrl } = await req.json();

  if (!id || !name || !homeUrl) {
    return NextResponse.json(
      { message: "Bad Request: Missing required fields" },
      { status: 400 }
    );
  }

  const updatedMaterial = await prisma.material.update({
    where: {
      id,
    },
    data: {
      name,
      slug: formatSlug(name),
      homeUrl,
    },
  });

  return NextResponse.json(updatedMaterial, { status: 200 });
}
