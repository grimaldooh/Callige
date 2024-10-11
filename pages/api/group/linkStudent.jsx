// pages/api/group/linkStudent.jsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { studentId, groupId } = req.body;

    // Validar que se hayan proporcionado ambos IDs
    if (!studentId || !groupId) {
      return res.status(400).json({ error: 'Student ID and Group ID are required' });
    }

    try {
      // Crear una relación en la tabla de unión entre estudiantes y grupos
      const studentGroupRelation = await prisma.student.update({
        where: { id: parseInt(studentId, 10) },
        data: {
          groups: {
            connect: { id: parseInt(groupId, 10) }, // Vincular el grupo
          },
        },
      });

      res.status(200).json(studentGroupRelation);
    } catch (error) {
      console.error('Error linking student to group:', error);
      res.status(500).json({ error: 'Error linking student to group' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
