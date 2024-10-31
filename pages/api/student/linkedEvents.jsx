// src/pages/api/student/linkedEvents.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { studentId } = req.query;

    try {
      // Obtener los eventos vinculados al estudiante
      const student = await prisma.student.findUnique({
        where: { id: parseInt(studentId) },
        include: {
          events: true,  // Incluir eventos vinculados
        },
      });

      if (student) {
        return res.status(200).json({ events: student.events });
      } else {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
      await prisma.$disconnect();
    }
  }
}