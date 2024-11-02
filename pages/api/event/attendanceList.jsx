// pages/api/event/attendanceList.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { eventId } = req.query;

  if (!eventId) {
    return res.status(400).json({ error: 'El ID del evento es requerido.' });
  }

  try {
    const attendanceList = await prisma.attendanceList.findUnique({
      where: {
        eventId: parseInt(eventId),
      },
      include: {
        attendances: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!attendanceList) {
      return res.status(404).json({ error: 'No se encontró lista de asistencia para este evento.' });
    }

    res.status(200).json(attendanceList);
  } catch (error) {
    console.error("Error al obtener la lista de asistencia:", error);
    res.status(500).json({ error: 'Error al obtener la lista de asistencia' });
  } finally {
    await prisma.$disconnect();
  }
}