import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { parse } from 'path';

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
    const { name, email, password , school_id} = req.body;
    const globalSchoolId = school_id;
    console.log('schoolId:', globalSchoolId);

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, password and group_id are required' });
    }
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });
    const existingTeacher = await prisma.teacher.findUnique({
      where: { email },
    });
    const existingSuperAdmin = await prisma.superadmin.findUnique({
      where: { email },
    });

    if (existingStudent || existingAdmin || existingTeacher || existingSuperAdmin) {
      return res
        .status(400)
        .json({ error: "El correo electrónico ya está en uso" });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newTeacher = await prisma.teacher.create({
        data: {
          password : hashedPassword,
          name: String(name),
          email: String(email),
          school_id: parseInt(globalSchoolId),
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