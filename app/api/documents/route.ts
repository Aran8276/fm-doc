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
