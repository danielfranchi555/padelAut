-- CreateEnum
CREATE TYPE "CourtSide" AS ENUM ('drive', 'backhand');

-- AlterTable
ALTER TABLE "PlayerProfile" ADD COLUMN     "side" "CourtSide";
