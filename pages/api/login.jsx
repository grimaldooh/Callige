import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Request received:', req.body);

  try {
    // Buscar el usuario en las distintas tablas

    const admin = await prisma.admin.findUnique({ where: { email } });
    const student = await prisma.student.findUnique({ where: { email } });
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    const superAdmin = await prisma.superAdmin.findUnique({ where: { email } });
    console.log('Admin:', admin);
    console.log('Student:', student);
    console.log('Teacher:', teacher);
    console.log('SuperAdmin:', superAdmin);

    let user = null;
    let role = '';

    if (admin) {
      user = admin;
      role = 'admin';
      console.log('Admin found:', user);
    } else if (student) {
      user = student;
      role = 'student';
      console.log('Student found:', user);
    } else if (teacher) {
      user = teacher;
      role = 'teacher';
      console.log('Teacher found:', user);
    } else if (superAdmin) {
      user = superAdmin;
      role = 'superadmin';
      console.log('SuperAdmin found:', user);
    }

    // Si no se encontró el usuario
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Comparar la contraseña
    console.log('Comparing passwords');
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Incorrect password');
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Devolver el rol del usuario
    console.log('Login successful, role:', role);
    res.status(200).json({ role });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export default login;