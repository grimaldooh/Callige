import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, location } = req.body;

    try {
      const newSchool = await prisma.school.create({
        data: {
          name,
          location,
        },
      });
      res.status(201).json(newSchool);
    } catch (error) {
      res.status(500).json({ error: 'Error creating school' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}