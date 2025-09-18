import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { formatSlug } from "@/lib/formatSlug";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  // handle admin validation here
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  const newMaterial = await prisma.material.create({
    data: {
      name,
      slug: formatSlug(name),
    },
  });

  return NextResponse.json(newMaterial, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { message: "Bad Request: Missing ID" },
      { status: 400 }
    );
  }

  const newMaterial = await prisma.material.update({
    where: {
      id,
    },
    data: {
      name,
      slug: formatSlug(name),
    },
  });

  return NextResponse.json(newMaterial, { status: 201 });
}
