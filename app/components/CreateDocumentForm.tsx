"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Loader, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateDocumentForm({
  mats,
}: {
  mats: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
  }[];
}) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [materialId, setMaterialId] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (!title) return;

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, materialId }),
      });

      if (res.ok) {
        const newDoc = await res.json();
        router.push(`/documents/${newDoc.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="px-6 cursor-pointer h-full">
            <Plus />
            Tambah Materi
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Tambah Materi</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="material" className="text-sm w-fit">
                  Peminatan
                </Label>
                <Select required onValueChange={setMaterialId}>
                  <SelectTrigger id="material" className="w-full mb-2">
                    <SelectValue placeholder="Pilih Peminatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {mats.map((item, index) => (
                        <SelectItem
                          key={index}
                          className="cursor-pointer"
                          value={item.id}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Label htmlFor="title" className="text-sm w-fit">
                  Nama Materi
                </Label>
                <Input
                  required
                  placeholder="Masukan nama Materi..."
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild className="cursor-pointer">
                <Button variant={`outline`}>Batalkan</Button>
              </DialogClose>
              {loading ? (
                <Button disabled className="px-6 cursor-pointer h-full">
                  <Loader className="animate-spin" />
                  Tambah
                </Button>
              ) : (
                <Button type="submit" className="px-6 cursor-pointer h-full">
                  <Plus />
                  Tambah
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
