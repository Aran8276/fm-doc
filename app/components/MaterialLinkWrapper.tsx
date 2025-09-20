"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Material } from "@prisma/client";

export function MaterialLinkWrapper({
  item,
  children,
}: {
  item: Material;
  children: React.ReactNode;
}) {
  const [showAlert, setShowAlert] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!item.homeUrl) {
      e.preventDefault();
      setShowAlert(true);
    }
  };

  return (
    <>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Materi dalam Pengembangan</AlertDialogTitle>
            <AlertDialogDescription>
              Materi untuk peminatan ini sedang dalam pengembangan. Silakan cek
              kembali nanti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Link
        href={item.homeUrl ? `/docs/${item.id}/${item.homeUrl}` : "#"}
        onClick={handleClick}
        className="block"
      >
        {children}
      </Link>
    </>
  );
}
