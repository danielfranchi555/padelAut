-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- AlterTable
ALTER TABLE "PlayerProfile" ADD COLUMN     "gender" "Gender";
