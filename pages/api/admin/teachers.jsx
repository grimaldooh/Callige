import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const teachers = await prisma.teacher.findMany();
      res.status(200).json({ teachers });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching students' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
