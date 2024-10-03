import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener estudiantes
    try {
      const students = await prisma.student.findMany();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching students' });
    }
  } else if (req.method === 'POST') {
    // Añadir un nuevo estudiante
    const { name, email, password, group_id } = req.body;
    console.log(req.body);

    // Validación de entrada
    if (!name || !email || !password || !group_id) {
      return res.status(400).json({ error: 'Name, email, password and group_id are required' });
    }

    try {
      console.log({ name, email, password, group_id }); // Verifica que los datos se estén pasando correctamente

      const newStudent = await prisma.student.create({
        data: {
          password: String(password), 
          name: String(name),
          email: String(email),
          group_id: group_id ? Number(group_id) : null,   
        },
      });
      res.status(201).json(newStudent);
      console.log(newStudent);
    } catch (error) {
      // Manejar error por email duplicado
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'Error adding student' });
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}