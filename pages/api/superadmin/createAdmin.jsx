import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password, schoolId } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await prisma.admin.create({
        data: {
          name,
          email,
          password : hashedPassword,
          school_id: parseInt(schoolId),
        },
      });

      const updatedSchool = await prisma.school.findUnique({
        where: { id: parseInt(schoolId) },
        include: { admins: true },
      });

      res.status(201).json(updatedSchool);
    } catch (error) {
      res.status(500).json({ error: 'Error creating admin' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}