"use client";

import { toast } from "sonner";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";

export default function CreateMaterialForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (!name) return;

      const res = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        const newMat = await res.json();
        toast(`Materi ${newMat?.name} berhasil ditambahkan!`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <form onSubmit={handleSubmit} className="flex space-x-4 h-10">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Tambahkan materi jurusan baru..."
          className="h-full"
        />
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
      </form>
    </>
  );
}
