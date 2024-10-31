// pages/api/event/linkTeacher.jsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { teacherId, eventId } = req.body;

    // Validar que se hayan proporcionado ambos IDs
    if (!teacherId || !eventId) {
      return res.status(400).json({ error: 'Teacher ID and event ID are required' });
    }

    try {
      // Crear una relación en la tabla de unión entre estudiantes y grupos
      const teacherEventRelation = await prisma.teacher.update({
        where: { id: parseInt(teacherId, 10) },
        data: {
          events: {
            connect: { id: parseInt(eventId, 10) }, // Vincular el grupo
          },
        },
      });

      res.status(200).json(teacherEventRelation);
    } catch (error) {
      console.error('Error linking teacher to event:', error);
      res.status(500).json({ error: 'Error linking teacher to event' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
