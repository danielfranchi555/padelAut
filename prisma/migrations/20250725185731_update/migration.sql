-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "resultA" INTEGER,
ADD COLUMN     "resultB" INTEGER;

-- AlterTable
ALTER TABLE "MatchPlayer" ADD COLUMN     "confirmedAt" TIMESTAMP(3);
