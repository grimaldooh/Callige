import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { groupId, studentId } = req.body;

    if (!groupId || !studentId) {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }

    try {
      // Desvincula al estudiante del grupo
      await prisma.group.update({
        where: { id: groupId },
        data: {
          students: {
            disconnect: { id: studentId },
          },
        },
      });

      return res.status(200).json({ message: 'Estudiante desvinculado con éxito' });
    } catch (error) {
      console.error('Error al desvincular el estudiante:', error);
      return res.status(500).json({ error: 'Error al desvincular el estudiante' });
    }
  } else {
    // Manejar métodos HTTP no permitidos
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }
}