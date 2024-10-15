// pages/api/student/getGroups.jsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { studentId } = req.query;

    // Validar que se haya proporcionado el studentId
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    try {
      // Obtener los grupos vinculados con el estudiante
      const studentGroups = await prisma.student.findUnique({
        where: { id: parseInt(studentId, 10) },
        select: {
          groups: true, // Obtener los grupos vinculados
        },
      });

      if (!studentGroups) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.status(200).json(studentGroups.groups);
    } catch (error) {
      console.error('Error fetching student groups:', error);
      res.status(500).json({ error: 'Error fetching student groups' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}