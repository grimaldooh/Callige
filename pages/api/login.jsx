import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const prisma = new PrismaClient();

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Request received:', req.body);

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    // Buscar el usuario en las distintas tablas
    const admin = await prisma.admin.findUnique({ where: { email } });
    const student = await prisma.student.findUnique({ where: { email } });
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    const superAdmin = await prisma.superadmin.findUnique({ where: { email } });

    console.log('Admin:', admin);
    console.log('Student:', student);
    console.log('Teacher:', teacher);
    console.log('SuperAdmin:', superAdmin);

    let user = null;
    let role = '';

    if (admin) {
      user = admin;
      role = 'admin';
      //console.log('Admin found:', user);
    } else if (student) {
      user = student;
      role = 'student';
      //console.log('Student found:', user);
    } else if (teacher) {
      user = teacher;
      role = 'teacher';
      //console.log('Teacher found:', user);
    } else if (superAdmin) {
      user = superAdmin;
      role = 'superadmin';
      //console.log('SuperAdmin found:', user);
    }

    // Si no se encontró el usuario
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Comparar la contraseña
    console.log('Comparing passwords');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isMatch);

    if (!isMatch) {
      console.log('Incorrect password');
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generar el token
    const token = jwt.sign(
      { userId: user.id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    //console.log('Generated token:', token);

    // Establecer la cookie
    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hora
      path: '/',
    }));

    // Devolver la respuesta
    console.log('Login successful, role:', role);
    res.status(200).json({ 
      userId: user.id, // ID del usuario
      schoolId: user.school_id, // schoolId asociado
      role,
      token,
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  } finally {
    await prisma.$disconnect();
  }
};

export default login;