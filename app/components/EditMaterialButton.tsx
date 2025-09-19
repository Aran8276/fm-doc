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
    homeUrl: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
  };
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [homeUrl, setHomeUrl] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!name || !homeUrl) return;

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
                URL Beranda
              </Label>
              <Input
                id="homeUrl"
                value={homeUrl}
                onChange={(e) => setHomeUrl(e.target.value)}
              />
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
