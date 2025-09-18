// src/app/page.tsx
import prisma from "@/src/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import CreateDocumentForm from "./components/CreateDocumentForm";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const documents = await prisma.document.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Documents</h1>
      {session && <CreateDocumentForm />}
      <ul className="mt-6 space-y-4">
        {documents.map((doc) => (
          <li key={doc.id} className="p-4 border rounded-md shadow-sm">
            <Link
              href={`/documents/${doc.id}`}
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {doc.title}
            </Link>
            <p className="text-sm text-gray-500">
              Created by {doc.author.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
