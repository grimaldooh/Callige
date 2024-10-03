/*
  Warnings:

  - Made the column `schoolId` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `groupId` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "schoolId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "groupId" SET NOT NULL;
