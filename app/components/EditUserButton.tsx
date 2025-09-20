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
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserRole } from "@prisma/client";
import { updateUserRole } from "../(admin)/manage-user/actions";

const EditUserButton = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateUserRole(user.id, role);
    if (result.success) {
      toast(`Pengguna ${result.user?.name} berhasil di edit!`);
      setOpen(false);
    } else {
      toast.error(result.message || "Gagal mengedit pengguna.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

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
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name" className="text-sm w-fit">
                Nama Pengguna
              </Label>
              <Input id="name" value={user.name} readOnly />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email" className="text-sm w-fit">
                Email Pengguna
              </Label>
              <Input id="email" value={user.email} readOnly />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="role" className="text-sm w-full">
                Role
              </Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <SelectTrigger className="w-full" id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(UserRole).map((roleValue) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={roleValue}
                        value={roleValue}
                      >
                        {roleValue}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-sm w-fit">Password</Label>
              <p className="text-sm cursor-not-allowed p-3 bg-secondary rounded-md text-secondary-foreground">
                Password tidak dapat diganti.
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
                Simpan
              </Button>
            ) : (
              <Button
                type="submit"
                className="text-white bg-blue-500 hover:bg-blue-500/80 cursor-pointer"
              >
                <Pencil />
                Simpan
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(EditUserButton);
