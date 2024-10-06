import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const totalStudents = await prisma.student.count();
      const totalTeachers = await prisma.teacher.count();
      const totalGroups = await prisma.group.count();

      res.status(200).json({ totalStudents, totalTeachers, totalGroups });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching statistics' });
      console.error('Error fetching statistics:', error);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}