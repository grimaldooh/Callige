

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// API route to fetch the groups linked to the student
export default async function handler(req, res) {
  const { studentId } = req.query; // Obtener el schoolId de la query
  console.log('studentId:', studentId);
  if (req.method === 'GET') {
    try {
      console.log('studentId:', studentId);
      const groups = await prisma.group.findMany({
        where: {
          students: {
            some: {
              id: parseInt(studentId),
            },
          },
        },
      });
      console.log('groups:', groups);

      res.status(200).json({ groups });
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ error: 'Error fetching groups' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
