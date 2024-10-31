import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // Se obtiene el id de req.query para usarlo en la URL
    console.log('id:', id);
  if (req.method === 'GET') {
    try {
      const student = await prisma.student.findUnique({
        where: { id: parseInt(id) },
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.status(200).json(student);
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ error: 'Error fetching student' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'PUT') {
    const { name, email } = req.body;
    try {
      const updatedStudent = await prisma.student.update({
        where: { id: parseInt(id) },
        data: { name, email },
      });
      res.status(200).json(updatedStudent);
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ error: 'Error updating student' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}