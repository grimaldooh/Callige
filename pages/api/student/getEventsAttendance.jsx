///pages/api/students/getEventsAttendance.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { studentId } = req.query;

    try {
      // Obtener los eventos pasados vinculados al estudiante
      const today = new Date();

      const events = await prisma.event.findMany({
        where: {
          students: {
            some: { id: parseInt(studentId) },
          },
          date: {
            lte: today,  // Eventos hasta hoy
          },
        },
        include: {
          attendanceList: {
            include: {
              attendances: {
                where: { student_id: parseInt(studentId) },
              },
            },
          },
        },
      });

      console.log('eventos', events);

      // Formatear respuesta para incluir presencia del estudiante en cada evento
      const formattedEvents = events.map(event => ({
        id: event.id,
        name: event.name,
        date: event.date,
        attended: event.attendanceList.attendances[0] && event.attendanceList.attendances[0].present === 1 ? true : false,      }));

      console.log('eventos formateados', formattedEvents);

      return res.status(200).json({ events: formattedEvents });
    } catch (error) {
      console.error('Error al obtener eventos de asistencia:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}