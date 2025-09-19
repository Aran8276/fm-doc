"use client";

import { Loader } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  signOut({ redirect: true });

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Loader className="size-12 animate-spin" />
    </div>
  );
}
