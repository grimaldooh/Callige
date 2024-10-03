/*
  Warnings:

  - You are about to drop the `_GroupToTeacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GroupToTeacher" DROP CONSTRAINT "_GroupToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToTeacher" DROP CONSTRAINT "_GroupToTeacher_B_fkey";

-- DropTable
DROP TABLE "_GroupToTeacher";

-- CreateTable
CREATE TABLE "_TeacherGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TeacherGroups_AB_unique" ON "_TeacherGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_TeacherGroups_B_index" ON "_TeacherGroups"("B");

-- AddForeignKey
ALTER TABLE "_TeacherGroups" ADD CONSTRAINT "_TeacherGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherGroups" ADD CONSTRAINT "_TeacherGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
