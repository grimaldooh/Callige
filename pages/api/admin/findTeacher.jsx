// /pages/api/admin/findTeacher.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const teacher = await prisma.teacher.findUnique({
        where: { id: parseInt(id) },
      });

      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

      res.status(200).json(teacher);
    } catch (error) {
      console.error('Error fetching teacher:', error);
      res.status(500).json({ error: 'Error fetching teacher' });
    }
  } else if (req.method === 'PUT') {
    const { name, email } = req.body;
    try {
      const updatedTeacher = await prisma.teacher.update({
        where: { id: parseInt(id) },
        data: { name, email },
      });
      res.status(200).json(updatedTeacher);
    } catch (error) {
      console.error('Error updating teacher:', error);
      res.status(500).json({ error: 'Error updating teacher' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}