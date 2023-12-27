-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "creatorId" TEXT;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
