/*
  Warnings:

  - You are about to drop the column `adminId` on the `School` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[schoolId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "School" DROP COLUMN "adminId";

-- CreateIndex
CREATE UNIQUE INDEX "Admin_schoolId_key" ON "Admin"("schoolId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
