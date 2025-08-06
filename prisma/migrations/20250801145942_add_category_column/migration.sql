/*
  Warnings:

  - You are about to drop the column `level` on the `PlayerProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerProfile" DROP COLUMN "level",
ADD COLUMN     "category" DOUBLE PRECISION;
