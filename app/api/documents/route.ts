import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { formatSlug } from "@/lib/formatSlug";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { title, materialId } = await req.json();
  const newDocument = await prisma.document.create({
    data: {
      title,
      materialId,
      authorId: session.user.id,
      slug: formatSlug(title),
      content: "",
    },
  });
  return NextResponse.json(newDocument, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, title, materialId } = await req.json();
    if (!id || !title || !materialId) {
      return NextResponse.json(
        { message: "Bad Request: Missing required fields" },
        { status: 400 }
      );
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        title,
        slug: formatSlug(title),
        materialId,
      },
    });
    return NextResponse.json(updatedDocument, { status: 200 });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
