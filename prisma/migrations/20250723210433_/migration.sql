/*
  Warnings:

  - You are about to drop the column `level` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerProfile" ADD COLUMN     "level" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "level";
