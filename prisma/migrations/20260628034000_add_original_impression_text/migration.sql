-- AlterTable
ALTER TABLE "ClientImpression"
ADD COLUMN IF NOT EXISTS "originalImpression" TEXT;
