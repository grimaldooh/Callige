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
        const students = await prisma.group.findUnique({
          where: { id: parseInt(groupId, 10) },
          include: {
            students: true,  // Incluir los estudiantes asociados al grupo
          },
        });
        console.log('students:', students);
        res.status(200).json(students);
      } else {
        res.status(400).json({ error: 'School ID or Group ID required' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
    } finally {
      await prisma.$disconnect();
    }
  }  else if (req.method === 'POST') {
    // Añadir un nuevo grupo
    const { name, school_id, classDays} = req.body;
    console.log('name:', name);
    console.log('school_id:', school_id);

    // Validación de entrada
    if (!name || !school_id) {
      return res.status(400).json({ error: 'Name, school_id, and teacher_id are required' });
    }

    try {
      const newGroup = await prisma.group.create({
        data: {
          name,
          school_id : parseInt(school_id),
          classDays,
        },
      });
      res.status(201).json(newGroup);
    } catch (error) {
      console.error('Error adding group:', error);
      res.status(500).json({ error: 'Error adding group' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}