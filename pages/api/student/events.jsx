import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const studentId = parseInt(req.query.studentId, 10); // Aseguramos que el ID sea un número
      if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
      }

      // Consulta los eventos ligados al profesor con ID studentId
      const events = await prisma.event.findMany({
        where: {
          students: {
            some: { id: studentId }, // Revisa la relación con el profesor
          },
        },
        orderBy: { date: 'asc' }, // Ordena por fecha ascendente
      });

      res.status(200).json({ events });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Error fetching events' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
