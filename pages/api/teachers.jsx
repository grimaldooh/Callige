import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener profesores
    try {
      const teachers = await prisma.teacher.findMany();
      res.status(200).json(teachers);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching teachers' });
    }
  } else if (req.method === 'POST') {
    // Añadir un nuevo profesor
    const { name, email, password, group_id } = req.body;

    if (!name || !email || !password || !group_id) {
      return res.status(400).json({ error: 'Name, email, password and group_id are required' });
    }
    try {
      const newTeacher = await prisma.teacher.create({
        data: {
          password: String(password), 
          name: String(name),
          email: String(email),
          group_id: group_id ? Number(group_id) : null,   
        },
      });
      res.status(201).json(newTeacher);
    } catch (error) {
      console.error('Error adding student:', error);
      res.status(500).json({ error: 'Error adding teacher' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}