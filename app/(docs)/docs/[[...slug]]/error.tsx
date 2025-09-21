"use client";

import { useEffect } from "react";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { createElement } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Captured by error.tsx:", error);
  }, [error]);

  let errorMessage = "An unknown error occurred while compiling MDX.";
  if (error) {
    errorMessage = `Terjadi kesalahan dalam meng-compile MDX: ${error.message}`;
    if (error.message.includes("is not defined")) {
      errorMessage += `\n\nJika Anda pengunjung AranDocs: Sedang ada kesalahan dalam materi ini, hubungi editor atau administrator dan cobalah sesaat lagi.\n\nJika Anda editor atau admin AranDocs: Periksa kembali konten pada halaman ini di Editor > Editor Materi`;
    }
  }

  const ErrorDisplay = () =>
    createElement(
      "div",
      { className: "text-red-500 p-4 border border-red-500 rounded-md" },
      createElement("pre", { style: { whiteSpace: "pre-wrap" } }, errorMessage)
    );

  return (
    <DocsPage toc={[]}>
      <DocsBody>
        <h1>Error</h1>
        <ErrorDisplay />
        <Button className="mt-4" onClick={() => reset()}>
          Coba lagi
        </Button>
      </DocsBody>
    </DocsPage>
  );
}
