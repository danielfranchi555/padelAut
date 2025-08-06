-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('pending', 'confirmed', 'cancelled');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "status" "MatchStatus" NOT NULL DEFAULT 'pending';
