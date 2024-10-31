import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Añadir un nuevo superadmin
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, password are required' });
        }
        try {
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newSuperAdmin = await prisma.superadmin.create({
            data: {
            password : hashedPassword,
            name: String(name),
            email: String(email),
            },
        });
        res.status(201).json(newSuperAdmin);
        } catch (error) {
        console.error('Error adding superadmin:', error);
        res.status(500).json({ error: 'Error adding superadmin' });
        } finally {
            await prisma.$disconnect();
          }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    }