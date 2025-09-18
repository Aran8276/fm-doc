import prisma from "@/src/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import CreateDocumentForm from "../../components/CreateDocumentForm";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const mats = await prisma.material.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const documents = await prisma.document.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });

  return (
    <section className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Dokumentasi</h1>
      {session && <CreateDocumentForm mats={mats} />}
      <ul className="mt-6 space-y-4">
        {Array.isArray(documents) && documents.length > 0 ? (
          documents.map((doc) => (
            <li key={doc.id} className="p-4 border rounded-md shadow-sm">
              <Link
                href={`/documents/${doc.id}`}
                className="text-xl font-semibold text-blue-600 hover:underline"
              >
                {doc.title}
              </Link>
              <p className="text-sm text-gray-500">
                Dibuat oleh {doc.author.name}
              </p>
              <p className="text-sm text-gray-500">
                {new Intl.DateTimeFormat("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(doc.createdAt)}
              </p>
            </li>
          ))
        ) : (
          <p className="w-full text-center mt-8">Belum ada dokumentasi.</p>
        )}
      </ul>
    </section>
  );
}
