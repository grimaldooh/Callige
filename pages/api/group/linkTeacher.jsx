// pages/api/group/linkTeacher.jsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { teacherId, groupId } = req.body;

    // Validar que se hayan proporcionado ambos IDs
    if (!teacherId || !groupId) {
      return res.status(400).json({ error: 'Teacher ID and Group ID are required' });
    }

    try {
      // Crear una relación en la tabla de unión entre estudiantes y grupos
      const teacherGroupRelation = await prisma.teacher.update({
        where: { id: parseInt(teacherId, 10) },
        data: {
          groups: {
            connect: { id: parseInt(groupId, 10) }, // Vincular el grupo
          },
        },
      });

      res.status(200).json(teacherGroupRelation);
    } catch (error) {
      console.error('Error linking teacher to group:', error);
      res.status(500).json({ error: 'Error linking teacher to group' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
