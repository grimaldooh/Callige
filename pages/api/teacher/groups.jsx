

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// API route to fetch the groups linked to the teacher
export default async function handler(req, res) {
  const { teacherId } = req.query; // Obtener el schoolId de la query
  console.log('teacherId:', teacherId);
  if (req.method === 'GET') {
    try {
      console.log('teacherId:', teacherId);
      const groups = await prisma.group.findMany({
        where: {
          teachers: {
            some: {
              id: parseInt(teacherId),
            },
          },
        },
      });
      console.log('groups:', groups);

      res.status(200).json({ groups });
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ error: 'Error fetching groups' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
