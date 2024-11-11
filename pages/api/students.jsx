import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const { uploadImage } = require('../../azure/blob'); // Ruta del archivo donde tienes la lógica de Azure
const prisma = new PrismaClient();
const multer = require('multer');

// Configura Multer para almacenar los archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
});

export const config = {
  api: {
    bodyParser: false,  // Necesario para que multer maneje el body del request
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener estudiantes
    try {
      const students = await prisma.student.findMany();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching students' });
    } finally {
      await prisma.$disconnect();
    }
  }else if (req.method === 'POST') {
    // Cambia la configuración para recibir ambos archivos
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'secondImage', maxCount: 1 }])(req, res, async function (err) {
      if (err) {
        console.error('Error uploading images:', err);
        return res.status(500).json({ error: 'Error uploading images' });
      }
      console.log('req.body:', req.body);
      const { name, email, password, globalSchoolId } = req.body;
      console.log('schoolId:', globalSchoolId);
      const hashedPassword = await bcrypt.hash(password, 10);
  
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      const existingStudent = await prisma.student.findUnique({ where: { email } });
      const existingAdmin = await prisma.admin.findUnique({ where: { email } });
      const existingTeacher = await prisma.teacher.findUnique({ where: { email } });
      const existingSuperAdmin = await prisma.superadmin.findUnique({ where: { email } });
  
      if (existingStudent || existingAdmin || existingTeacher || existingSuperAdmin) {
        console.log('El correo electrónico ya está en uso');
        return res.status(400).json({ error: "El correo electrónico ya está en uso" });
      }
  
      try {
        // Subir ambas imágenes si están presentes y obtener sus URLs
        let imageUrl = null;
        let imageUrl2 = null;
  
        if (req.files['image']) {
          imageUrl = await uploadImage(req.files['image'][0]);
        }
  
        if (req.files['secondImage']) {
          imageUrl2 = await uploadImage(req.files['secondImage'][0]);
        }
  
        const newStudent = await prisma.student.create({
          data: {
            name,
            email,
            status: 1,
            password: hashedPassword,
            school_id: parseInt(globalSchoolId),
            imageUrl,
            imageUrl2, // Guarda la URL de la segunda imagen
          },
        });
        //res.status(200).json({ message: 'Correos enviados exitosamente' });

        res.status(201).json(newStudent);
      } catch (error) {
        console.error('Error creando el estudiante:', error);
        res.status(500).json({ error: 'Error creando el estudiante' });
      } finally {
        await prisma.$disconnect();
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}