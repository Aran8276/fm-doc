/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/src/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export const deleteMaterial = async (id: string) => {
  try {
    const material = await prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      throw new Error("Material not found");
    }

    const filePath = path.join(process.cwd(), "public", material.imageUrl);

    try {
      await unlink(filePath);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        console.error("Error deleting file:", error);
        throw new Error("Could not delete the associated file.");
      }
    }

    await prisma.material.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.error("Error deleting material:", error);
    throw error;
  }
};

export const deleteDoc = async (id: string) => {
  await prisma.document.delete({
    where: {
      id: id,
    },
  });
};
