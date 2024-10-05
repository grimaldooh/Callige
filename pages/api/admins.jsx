import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener admins
    try {
      const admins = await prisma.admin.findMany();
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching admins' });
    }
  } else if (req.method === 'POST') {
    // Añadir un nuevo admin
    const { name, email, password, school_id } = req.body;

    if (!name || !email || !password || !school_id) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    try {
      const newAdmin = await prisma.admin.create({
        data: {
          name: String(name),
          email: String(email),
          password: String(password), 
          school_id: school_id ? Number(school_id) : null,
        },
      });
      res.status(201).json(newAdmin);
    } catch (error) {
      console.error('Error adding admin:', error);
      res.status(500).json({ error: 'Error adding admin' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}