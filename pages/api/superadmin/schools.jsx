import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const schools = await prisma.school.findMany({
        include: { admins: true },
      });
      res.status(200).json(schools);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching schools' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}