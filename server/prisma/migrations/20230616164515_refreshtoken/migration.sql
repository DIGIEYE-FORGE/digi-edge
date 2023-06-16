-- AlterTable
ALTER TABLE "users" ADD COLUMN "accessToken" TEXT;

-- CreateIndex
CREATE INDEX "users_accessToken_idx" ON "users"("accessToken");
