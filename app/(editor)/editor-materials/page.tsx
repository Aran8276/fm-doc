// app/(editor)/editor-materials/page.tsx
import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import CreateMaterialForm from "@/app/components/CreateMaterialForm";
import DeleteMaterialButton from "@/app/components/DeleteMaterialButton";
import EditMaterialButton from "@/app/components/EditMaterialButton";
import Image from "next/image";
import Controls from "./Controls";
import { Prisma } from "@prisma/client";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  const query = searchParams.q as string | undefined;
  const page = parseInt(searchParams.page as string) || 1;
  const limit = parseInt(searchParams.limit as string) || 5;
  const skip = (page - 1) * limit;

  const where: Prisma.MaterialWhereInput = query
    ? { name: { contains: query, mode: "insensitive" } }
    : {};

  const materials = await prisma.material.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { Document: { select: { id: true, title: true } } },
    take: limit,
    skip,
  });

  const totalMaterials = await prisma.material.count({ where });
  const totalPages = Math.ceil(totalMaterials / limit);

  return (
    <section className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Peminatan</h1>
        {session && <CreateMaterialForm />}
      </div>
      <Controls totalPages={totalPages} />
      <ul className="mt-6 space-y-4">
        {materials.length > 0 ? (
          materials.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-start border rounded-md shadow-sm"
            >
              <section className="flex gap-4">
                <Image
                  className="size-[160px] object-cover rounded-l-sm"
                  width={160}
                  height={160}
                  alt={doc.name}
                  src={doc.imageUrl}
                />
                <div className="flex flex-col p-4">
                  <p className="text-xl font-semibold">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    }).format(doc.createdAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">{doc.homeUrl}</p>
                  <section className="flex items-end h-full gap-3">
                    <EditMaterialButton doc={doc} />
                    <DeleteMaterialButton id={doc.id} />
                  </section>
                </div>
              </section>
            </li>
          ))
        ) : (
          <p className="w-full text-center mt-8">
            {query
              ? `Tidak ada peminatan dengan nama "${query}".`
              : "Belum ada Peminatan."}
          </p>
        )}
      </ul>
    </section>
  );
}
