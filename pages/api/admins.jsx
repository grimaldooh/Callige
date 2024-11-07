import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener admins
    try {
      const admins = await prisma.admin.findMany();
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching admins' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'POST') {
    // Añadir un nuevo admin
    const { name, email, password, schoolId} = req.body;
    console.log('req.body:', req.body);

    if (!name || !email || !password || !schoolId) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
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

      const newAdmin = await prisma.admin.create({
        data: {
          name: String(name),
          email: String(email),
          password : hashedPassword,
          school_id: parseInt(schoolId),
        },
      });
      res.status(201).json(newAdmin);
    } catch (error) {
      console.error('Error adding admin:', error);
      res.status(500).json({ error: 'Error adding admin' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}