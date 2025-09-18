"use server";
import prisma from "@/src/lib/prisma";

export const deleteMaterial = async (id: string) => {
  await prisma.material.delete({
    where: {
      id: id,
    },
  });
};
