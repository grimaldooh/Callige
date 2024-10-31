// pages/api/group/unlinkTeacher.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { groupId, teacherId } = req.body;

    try {
      await prisma.group.update({
        where: { id: groupId },
        data: {
          teachers: {
            disconnect: { id: teacherId },
          },
        },
      });

      return res.status(200).json({ message: 'Profesor desvinculado correctamente' });
    } catch (error) {
      console.error('Error desvinculando profesor:', error);
      return res.status(500).json({ message: 'Error al desvincular profesor' });
    } finally {
      await prisma.$disconnect();
    }
  }

  return res.status(405).json({ message: 'Método no permitido' });
}