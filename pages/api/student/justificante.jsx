import { PrismaClient } from '@prisma/client';
import { parse } from 'path';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { studentId } = req.query;

    try {
      const justificantes = await prisma.justificante.findMany({
        where: { student_id: parseInt(studentId) },
        include: { group: true }, // Incluir datos del grupo
      });

      res.status(200).json(justificantes);
    } catch (error) {
      console.error('Error fetching justificantes:', error);
      res.status(500).json({ error: 'Error fetching justificantes' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}