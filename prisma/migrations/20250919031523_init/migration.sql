/*
  Warnings:

  - Added the required column `homeUrl` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Material" ADD COLUMN     "homeUrl" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;
