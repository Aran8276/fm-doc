/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/src/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export const deleteMaterial = async (id: string) => {
  try {
    const material = await prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      return { success: false, message: "Material not found" };
    }

    const filePath = path.join(process.cwd(), "public", material.imageUrl);

    try {
      await unlink(filePath);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        console.error("Error deleting file:", error);
        return {
          success: false,
          message: "Could not delete the associated file.",
        };
      }
    }

    await prisma.material.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/editor-materials");
    return { success: true };
  } catch (error) {
    console.error("Error deleting material:", error);
    return { success: false, message: "An internal error occurred." };
  }
};

export const deleteDoc = async (id: string) => {
  try {
    await prisma.document.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/editor-docs");
    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false, message: "An internal error occurred." };
  }
};
