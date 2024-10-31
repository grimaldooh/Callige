// pages/api/event/linkstudent.jsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { studentId, eventId } = req.body;
    console.log('studentId:', studentId);
    console.log('eventId:', eventId);

    // Validar que se hayan proporcionado ambos IDs
    if (!studentId || !eventId) {
      return res.status(400).json({ error: 'student ID and event ID are required' });
    }

    try {
      // Crear una relación en la tabla de unión entre estudiantes y grupos
      const studentEventRelation = await prisma.student.update({
        where: { id: parseInt(studentId, 10) },
        data: {
          events: {
            connect: { id: parseInt(eventId, 10) },
          },
        },
      });

      res.status(200).json(studentEventRelation);
    } catch (error) {
      console.error('Error linking student to event:', error);
      res.status(500).json({ error: 'Error linking student to event' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
