// src/app/api/documents/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();

  const newDocument = await prisma.document.create({
    data: {
      title,
      authorId: session.user.id,
      content: "",
    },
  });

  return NextResponse.json(newDocument, { status: 201 });
}
