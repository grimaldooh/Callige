import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { schoolId } = req.query;

    try {
      if (schoolId) {
        // Obtener eventos de una escuela específica
        const events = await prisma.event.findMany({
          where: { school_id: parseInt(schoolId, 10) },
        });
        res.status(200).json(events);
      } else {
        // Si no se proporciona schoolId, devuelve todos los eventos
        const events = await prisma.event.findMany();
        res.status(200).json(events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Error fetching events' });
    }
  } else if (req.method === 'POST') {
    const { name, date, description,location, school_id, teacher_id } = req.body;
    console.log(req.body);
    // Validación de entrada
    if (!name || !date || !description || !location) {
        console.log('Error adding event:', 'Title, date, and description are required');
      return res.status(400).json({ error: 'Title, date, and description are required' });
      
    }

    try {
      const newEvent = await prisma.event.create({
        data: {
          name: String(name),
          date: new Date(date),
          location: String(location),
          description: String(description),
          teacher_id : teacher_id ? Number(teacher_id) : null,
          school_id: school_id ? Number(school_id) : null,
        },
      });
      console.log('Event added:', newEvent);
      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error adding event:', error);
      res.status(500).json({ error: 'Error adding event' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}