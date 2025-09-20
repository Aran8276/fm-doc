"use client";

import { Button } from "@/components/ui/button";
import { Loader, Pencil } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Document, Material } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditDocsButtonProps {
  doc: Document & { material: Material };
  mats: Material[];
}

const EditDocsButton = ({ doc, mats }: EditDocsButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!title || !materialId) return;

      const res = await fetch("/api/documents", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: doc.id, title, materialId }),
      });

      if (res.ok) {
        const updatedDoc = await res.json();
        toast(`Materi "${updatedDoc.title}" berhasil diubah!`);
        router.refresh();
        setOpen(false);
      } else {
        toast.error("Gagal mengubah materi.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Terjadi sebuah kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doc) {
      setTitle(doc.title);
      setMaterialId(doc.materialId);
    }
  }, [doc]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-600/80 text-white cursor-pointer"
          size={`icon`}
        >
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Materi</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="title" className="text-sm w-fit">
                Nama Materi
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="material" className="text-sm w-fit">
                Peminatan
              </Label>
              <Select value={materialId} onValueChange={setMaterialId}>
                <SelectTrigger className="w-full" id="material">
                  <SelectValue placeholder="Pilih Peminatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {mats.map((item) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild className="cursor-pointer">
              <Button variant={`outline`}>Batalkan</Button>
            </DialogClose>
            {loading ? (
              <Button
                disabled
                className="text-white bg-blue-500 hover:bg-blue-500/80 cursor-pointer"
              >
                <Loader className="animate-spin" /> Edit
              </Button>
            ) : (
              <Button
                type="submit"
                className="text-white bg-blue-500 hover:bg-blue-500/80 cursor-pointer"
              >
                <Pencil /> Edit
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(EditDocsButton);
