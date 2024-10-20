// src/pages/api/student/unlinkEvent.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { studentId, eventId } = req.body;

    try {
      await prisma.event.update({
        where: { id: eventId },
        data: {
          students: {
            disconnect: { id: studentId }, // Desvincular al estudiante
          },
        },
      });

      return res.status(200).json({ message: 'Asistencia cancelada exitosamente' });
    } catch (error) {
      console.error('Error al cancelar asistencia:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}