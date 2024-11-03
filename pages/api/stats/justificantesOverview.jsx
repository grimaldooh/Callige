import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { schoolId } = req.query;

    // Consulta para obtener todos los justificantes del schoolId
    const justificantes = await prisma.justificante.findMany({
      where: { student: { school_id: parseInt(schoolId) } },
      select: { razon: true, status: true }
    });

    res.status(200).json(justificantes);
  } catch (error) {
    console.error('Error fetching justificantes:', error);
    res.status(500).json({ error: 'Error fetching justificantes' });
  }
}