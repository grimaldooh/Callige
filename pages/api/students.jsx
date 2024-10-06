import { PrismaClient } from '@prisma/client';
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
    }
  } else if (req.method === 'POST') {
    // Usa el middleware de multer para manejar la subida de archivos
    upload.single('image')(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error uploading image' });
      }

      const { name, email, password, group_id } = req.body;
      console.log('req.body:', req.body);

      // Valida que los datos están completos
      if (!name || !email || !password || !group_id) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
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
            password,
            group_id: parseInt(group_id, 10),
            imageUrl, // Guarda la URL de la imagen
          },
        });

        res.status(201).json(newStudent);
      } catch (error) {
        console.error('Error creando el estudiante:', error);
        res.status(500).json({ error: 'Error creando el estudiante' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}