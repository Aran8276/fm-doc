import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import Editor from "./Editor";

interface PageProps {
  params: {
    documentId: string;
  };
}

export default async function DocumentPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You must be logged in to view this document.</p>
      </div>
    );
  }

  const document = await prisma.document.findUnique({
    where: {
      id: params.documentId,
    },
  });

  if (!document) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
      <Editor
        documentId={document.id}
        initialContent={document.content || ""}
        userName={session.user?.name || "Anonymous"}
      />
    </div>
  );
}
