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

const EditMaterialButton = ({
  doc,
}: {
  doc: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
  };
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
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
        body: JSON.stringify({ id: doc.id, name }),
      });

      if (res.ok) {
        const newMat = await res.json();
        toast(`Materi Jurusan ${newMat.name} berhasil di edit!`);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (doc) {
      setName(doc.name);
    }
  }, [doc]);

  return (
    <Dialog>
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
            <DialogTitle>Edit Materi Jurusan</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="material" className="text-sm w-fit">
                Nama Materi Jurusan
              </Label>
              <Input
                id="material"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
                <Loader className="animate-spin" />
                Edit
              </Button>
            ) : (
              <Button
                type="submit"
                className="text-white bg-blue-500 hover:bg-blue-500/80 cursor-pointer"
              >
                <Pencil />
                Edit
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(EditMaterialButton);
