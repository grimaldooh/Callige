import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const multer = require('multer');
const { uploadImage } = require('../../../azure/blob');

export const config = {
    api: {
      bodyParser: false,
    },
  };
  const upload = multer({ storage: multer.memoryStorage() });


export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const event = await prisma.event.findUnique({
        where: { id: parseInt(id) },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.status(200).json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ error: "Error fetching event" });
    }
  } else if (req.method === 'PUT') {
    // Utilizar multer para procesar el formData
    upload.single('image')(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error uploading file' });
      }

      console.log('req.body:', req.body); // req.body ahora está vacío ya que estamos usando FormData
      console.log('req.file:', req.file); // Esto debería mostrar el archivo si se ha subido

      // Como req.body está vacío, necesitamos acceder a los campos del formulario
      const name = req.body.name || req.query.name;
      const description = req.body.description || req.query.description;
      const date = req.body.date || req.query.date;
      const location = req.body.location || req.query.location;
      const id = req.body.id || req.query.id;
      console.log('id:', id);

      try {
        // Obtener los datos del cuerpo (excluyendo la imagen inicialmente)
        const updatedData = {
          name: String(name),
          description: String(description),
          date: new Date(date),
          location: String(location),
        };

        // Si se ha subido una imagen, subirla a Azure Blob Storage
        if (req.file) {
          const imageUrl = await uploadImage(req.file);
          updatedData.imageUrl = imageUrl; // Añadir la URL de la imagen subida a los datos
        }
        console.log('id del evento:', id);
        // Actualizar el evento en la base de datos
        const updatedEvent = await prisma.event.update({
          where: { id: Number(id) },
          data: updatedData,
        });

        res.status(200).json(updatedEvent);
      } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el evento' });
        console.error('Error al actualizar el evento:', error);
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}