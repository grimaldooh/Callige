import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const reasonsCount = await prisma.justificante.groupBy({
        by: ['razon'],
        _count: {
          razon: true,
        },
        orderBy: {
          _count: {
            razon: 'desc',
          },
        },
      });

      res.status(200).json(reasonsCount);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching justificante reasons' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}