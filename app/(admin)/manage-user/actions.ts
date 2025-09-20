"use server";

import prisma from "@/src/lib/prisma";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/manage-user");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete user." };
  }
};

export const updateUserRole = async (id: string, role: UserRole) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        role: role,
      },
    });
    revalidatePath("/manage-user");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, message: "Failed to update user role." };
  }
};
