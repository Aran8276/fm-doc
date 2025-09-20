"use client";

import { Button } from "@/components/ui/button";
import { Loader, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { deleteMaterial } from "./action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const DeleteMaterialButton = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteMaterial(id);
    if (result.success) {
      toast("Materi berhasil dihapus!");
    } else {
      toast.error(result.message || "Gagal menghapus materi.");
    }
    setLoading(false);
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant={`destructive`}
            className="cursor-pointer"
            size={`icon`}
          >
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini akan menghapus file dari server secara permanen. Apakah
              anda benar-benar yakin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Batalkan
            </AlertDialogCancel>
            <AlertDialogAction asChild onClick={handleDelete}>
              {loading ? (
                <Button
                  className="text-white bg-red-500 hover:bg-red-500/80 cursor-pointer"
                  variant={`destructive`}
                  disabled
                >
                  <Loader className="animate-spin" />
                  Hapus
                </Button>
              ) : (
                <Button
                  className="text-white bg-red-500 hover:bg-red-500/80 cursor-pointer"
                  variant={`destructive`}
                >
                  <Trash2 />
                  Hapus
                </Button>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteMaterialButton;
