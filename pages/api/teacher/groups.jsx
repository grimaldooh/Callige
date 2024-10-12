

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// API route to fetch the groups linked to the teacher
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const teacherId = parseInt(req.query.teacherId, 10); // Assume teacherId is passed through the query
      const groups = await prisma.group.findMany({
        where: {
          teachers: {
            some: {
              id: teacherId,
            },
          },
        },
      });

      res.status(200).json({ groups });
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ error: 'Error fetching groups' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
