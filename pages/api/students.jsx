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
  } else if (req.method === 'POST') {
    // Usa el middleware de multer para manejar la subida de archivos
    const globalSchoolId = 1; 
    upload.single('image')(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error uploading image' });
      }

      const { name, email, password} = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log('req.body:', req.body);

      // Valida que los datos están completos
      if (!name || !email || !password ) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
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
        // Subir imagen a Azure Blob Storage si hay archivo
        let imageUrl = null;
        if (req.file) {
          imageUrl = await uploadImage(req.file) // Sube la imagen y obtén la URL
          console.log('URL de la imagen:', imageUrl);
        }

        // Crear un nuevo estudiante con la URL de la imagen
        const newStudent = await prisma.student.create({
          data: {
            name,
            email,
            status: 1,
            password : hashedPassword,
            school_id : globalSchoolId,
            imageUrl, // Guarda la URL de la imagen
          },
        });

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