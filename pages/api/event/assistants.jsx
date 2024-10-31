// src/pages/api/events/assistants.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(req, res) {
  const { eventId } = req.query;
  console.log('eventId:', eventId);

  if (req.method === 'GET') {
    try {
      const event = await prisma.event.findUnique({
        where: { id: parseInt(eventId) },
        include: {
          teachers: true,
          students: true,
        },
      });

      if (!event) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }

      res.status(200).json({
        teachers: event.teachers,
        students: event.students,
      });
    } catch (error) {
      console.error('Error fetching assistants:', error);
      res.status(500).json({ message: 'Error al obtener la lista de asistentes' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}