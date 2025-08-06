/*
  Warnings:

  - Made the column `level` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `number` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "level" SET NOT NULL,
ALTER COLUMN "number" SET NOT NULL;
