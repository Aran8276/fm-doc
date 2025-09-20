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
import { Material, Document } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditMaterialButtonProps {
  doc: Material & { Document: Pick<Document, "id" | "title">[] };
}

const EditMaterialButton = ({ doc }: EditMaterialButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [homeUrl, setHomeUrl] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!name) return;
      const res = await fetch("/api/materials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: doc.id, name, homeUrl }),
      });

      if (res.ok) {
        const newMat = await res.json();
        toast(`Peminatan ${newMat.name} berhasil di edit!`);
        router.refresh();
        setOpen(false);
      } else {
        toast.error("Failed to edit material.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doc) {
      setName(doc.name);
      setHomeUrl(doc.homeUrl);
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
            <DialogTitle>Edit Peminatan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="material" className="text-sm w-fit">
                Nama Peminatan
              </Label>
              <Input
                id="material"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="homeUrl" className="text-sm w-fit">
                Materi Beranda
              </Label>
              {doc.Document.length > 0 ? (
                <Select value={homeUrl} onValueChange={setHomeUrl}>
                  <SelectTrigger className="w-full" id="homeUrl">
                    <SelectValue placeholder="Pilih Materi Beranda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {doc.Document.map((document) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={document.id}
                          value={document.id}
                        >
                          {document.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm cursor-not-allowed p-3 bg-secondary rounded-md text-secondary-foreground">
                  Belum ada materi untuk peminatan ini.
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="image" className="text-sm w-fit">
                Gambar
              </Label>
              <p className="text-sm cursor-not-allowed p-3 bg-secondary rounded-md text-secondary-foreground">
                Gambar tidak dapat diubah.
              </p>
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

export default memo(EditMaterialButton);