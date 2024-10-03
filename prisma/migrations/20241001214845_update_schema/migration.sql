/*
  Warnings:

  - You are about to drop the `_TeacherGroups` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TeacherGroups" DROP CONSTRAINT "_TeacherGroups_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeacherGroups" DROP CONSTRAINT "_TeacherGroups_B_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "teacherId" INTEGER;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "adminId" INTEGER;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "groupId" INTEGER,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "groupId" INTEGER,
ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "_TeacherGroups";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "schoolId" INTEGER,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
