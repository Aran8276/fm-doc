import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import Editor from "./Editor";

interface PageProps {
  params: Promise<{
    documentId: string;
  }>;
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
      id: (await params).documentId,
    },
  });

  if (!document) {
    notFound();
  }

  return (
    <Editor
      documentId={document.id}
      initialContent={document.content || ""}
      title={document.title || ""}
      userName={session.user?.name || "Anonymous"}
    />
  );
}
