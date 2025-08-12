-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastUpdateDate" TIMESTAMP(3),
ADD COLUMN     "updatedCount" INTEGER NOT NULL DEFAULT 0;
