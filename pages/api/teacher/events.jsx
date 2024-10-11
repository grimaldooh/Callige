import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const teacherId = parseInt(req.query.teacherId, 10); // Aseguramos que el ID sea un número
      if (!teacherId) {
        return res.status(400).json({ error: 'Teacher ID is required' });
      }

      // Consulta los eventos ligados al profesor con ID teacherId
      const events = await prisma.event.findMany({
        where: {
          teachers: {
            some: { id: teacherId }, // Revisa la relación con el profesor
          },
        },
        orderBy: { date: 'asc' }, // Ordena por fecha ascendente
      });

      res.status(200).json({ events });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Error fetching events' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
