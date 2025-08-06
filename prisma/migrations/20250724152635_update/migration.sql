/*
  Warnings:

  - You are about to drop the column `userId` on the `MatchPlayer` table. All the data in the column will be lost.
  - Added the required column `playerId` to the `MatchPlayer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MatchPlayer" DROP CONSTRAINT "MatchPlayer_userId_fkey";

-- AlterTable
ALTER TABLE "MatchPlayer" DROP COLUMN "userId",
ADD COLUMN     "playerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "PlayerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
