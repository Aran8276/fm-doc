"use client";

import { toast } from "sonner";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CreateMaterialForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageFile) {
      toast.error("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("imageUrl", imageFile);
      const res = await fetch("/api/materials", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const newMat = await res.json();
        toast(`Materi ${newMat?.name} berhasil ditambahkan!`);
        setName("");
        setImageFile(null);
        const fileInput = document.getElementById(
          "imageFile"
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
        setOpen(false);
        setShowAlert(true);
      } else {
        toast.error("Failed to add material.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred.");
    } finally {
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Peminatan Berhasil Dibuat</AlertDialogTitle>
            <AlertDialogDescription>
              Selanjutnya, Anda perlu membuat Materi (Doc) untuk Peminatan ini
              dan menetapkannya sebagai Materi Beranda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="px-6 cursor-pointer h-full">
            <Plus /> Tambah Peminatan
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Tambah Peminatan</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Nama Peminatan</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Masukkan nama Peminatan baru..."
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="imageFile">Gambar</Label>
                <Input
                  id="imageFile"
                  type="file"
                  onChange={(e) =>
                    e.target.files ? setImageFile(e.target.files[0]) : null
                  }
                  required
                  accept="image/*"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              {loading ? (
                <Button disabled className="px-6 cursor-pointer">
                  <Loader className="animate-spin" /> Tambah
                </Button>
              ) : (
                <Button type="submit" className="px-6 cursor-pointer">
                  <Plus /> Tambah
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}