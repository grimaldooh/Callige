import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { schoolId, groupId } = req.query;

    try {
      if (schoolId) {
        // Obtener grupos de una escuela específica
        const groups = await prisma.group.findMany({
          where: { school_id: parseInt(schoolId, 10) },
        });
        res.status(200).json(groups);
      } else if (groupId) {
        // Obtener estudiantes de un grupo específico
        const students = await prisma.student.findMany({
          where: { group_id: parseInt(groupId, 10) },
        });
        res.status(200).json(students);
      } else {
        res.status(400).json({ error: 'School ID or Group ID required' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
    }
  }  else if (req.method === 'POST') {
    // Añadir un nuevo grupo
    const { name, school_id} = req.body;

    // Validación de entrada
    if (!name || !school_id) {
      return res.status(400).json({ error: 'Name, school_id, and teacher_id are required' });
    }

    try {
      const newGroup = await prisma.group.create({
        data: {
          name,
          school_id
        },
      });
      res.status(201).json(newGroup);
    } catch (error) {
      console.error('Error adding group:', error);
      res.status(500).json({ error: 'Error adding group' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}