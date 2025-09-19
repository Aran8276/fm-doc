import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import CreateMaterialForm from "@/app/components/CreateMaterialForm";
import DeleteMaterialButton from "@/app/components/DeleteMaterialButton";
import EditMaterialButton from "@/app/components/EditMaterialButton";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const documents = await prisma.material.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Peminatan</h1>
      {session && <CreateMaterialForm />}
      <ul className="mt-6 space-y-4">
        {Array.isArray(documents) && documents.length > 0 ? (
          documents.map((doc) => (
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
          <p className="w-full text-center mt-8">Belum ada Peminatan.</p>
        )}
      </ul>
    </section>
  );
}
