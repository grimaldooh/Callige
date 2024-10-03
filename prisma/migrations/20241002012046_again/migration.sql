/*
  Warnings:

  - You are about to drop the column `schoolId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `Teacher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[school_id]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[group_id]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_schoolId_fkey";

-- DropIndex
DROP INDEX "Admin_schoolId_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "schoolId",
ADD COLUMN     "school_id" INTEGER;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "schoolId",
DROP COLUMN "teacherId",
ADD COLUMN     "school_id" INTEGER;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "groupId",
ADD COLUMN     "group_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_school_id_key" ON "Admin"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_group_id_key" ON "Teacher"("group_id");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
