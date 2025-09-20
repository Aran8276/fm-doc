import prisma from "@/src/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import CreateDocumentForm from "../../components/CreateDocumentForm";
import DeleteDocButton from "@/app/components/DeleteDocButton";
import EditDocsButton from "@/app/components/EditDocsButton";
import Controls from "./Controls";
import { Prisma } from "@prisma/client";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  const query = searchParams.q as string | undefined;
  const materialId = searchParams.material as string | undefined;
  const page = parseInt(searchParams.page as string) || 1;
  const limit = parseInt(searchParams.limit as string) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.DocumentWhereInput = {};
  if (query) {
    where.title = { contains: query, mode: "insensitive" };
  }
  if (materialId) {
    where.materialId = materialId;
  }

  const documents = await prisma.document.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { author: true, material: true },
    take: limit,
    skip,
  });

  const totalDocuments = await prisma.document.count({ where });
  const totalPages = Math.ceil(totalDocuments / limit);

  const mats = await prisma.material.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Materi</h1>
        {session && <CreateDocumentForm mats={mats} />}
      </div>

      <Controls totalPages={totalPages} materials={mats} />

      <ul className="mt-6 space-y-4">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between py-4 px-8 border rounded-md shadow-sm"
            >
              <div className="flex space-y-1 flex-col">
                <div className="flex items-center gap-2">
                  {!materialId && (
                    <span className="text-white text-xl">
                      {doc.material.name} -
                    </span>
                  )}{" "}
                  <Link
                    href={`/documents/${doc.id}`}
                    className="text-xl font-semibold text-blue-600 hover:underline"
                  >
                    {doc.title}
                  </Link>
                </div>
                <p className="text-sm text-gray-500">
                  {" "}
                  Dibuat oleh {doc.author.name}{" "}
                </p>
                <p className="text-sm text-gray-500">
                  {" "}
                  {new Intl.DateTimeFormat("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  }).format(doc.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <EditDocsButton doc={doc} mats={mats} />
                <DeleteDocButton id={doc.id} />
              </div>
            </li>
          ))
        ) : (
          <p className="w-full text-center mt-8">
            {query || materialId
              ? "Tidak ada materi yang cocok dengan pencarian/filter."
              : "Belum ada Materi."}
          </p>
        )}
      </ul>
    </section>
  );
}
