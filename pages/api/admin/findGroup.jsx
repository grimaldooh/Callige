import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const group = await prisma.group.findUnique({
        where: { id: parseInt(id) },
      });

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      res.status(200).json(group);
    } catch (error) {
      console.error('Error fetching group:', error);
      res.status(500).json({ error: 'Error fetching group' });
    }
  } else if (req.method === 'PUT') {
    const { name } = req.body;
    try {
      const updatedGroup = await prisma.group.update({
        where: { id: parseInt(id) },
        data: { name }, // Solo actualizamos el nombre del grupo
      });
      res.status(200).json(updatedGroup);
    } catch (error) {
      console.error('Error updating group:', error);
      res.status(500).json({ error: 'Error updating group' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}