import { PrismaClient } from '@prisma/client';
const { uploadImage } = require('../../azure/blob'); // Ruta del archivo donde tienes la lógica de Azure
const multer = require('multer');

// Configurar multer para manejar archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,  // Necesario para que multer maneje el body del request
  },
};

// Adaptar la función para manejar la subida de archivos
export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { schoolId } = req.query; // Obtener el school_id de los parámetros de la consulta

        if (!schoolId) {
            return res.status(400).json({ error: 'School ID is required' });
        }

        try {
            const events = await prisma.event.findMany({
                where: {
                    school_id: Number(schoolId), // Filtrar por la escuela vinculada
                    //date: { gte: new Date() }, // Solo eventos futuros
                },
                orderBy: { date: 'asc' }, // Ordenar por fecha
            });

            console.log('events:', events);
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching events' });
            console.error('Error fetching events:', error);
        } finally {
            await prisma.$disconnect();
          }
    }  else if (req.method === 'POST') {
        // Utilizar multer para manejar el archivo de imagen
        upload.single('image')(req, res, async function (err) {
            if (err) {
                return res.status(500).json({ error: 'Error uploading file' });
            }

            // Acceder a los datos del cuerpo
            const { name, date, description, location, schoolId } = req.body;
            console.log('schoolId:', schoolId);

            // Validación de entrada
            if (!name || !date || !description || !location || !schoolId) {
                return res.status(400).json({ error: 'Title, date, description, and location are required' });
            }

            try {
                let imageUrl = null;
                if (req.file) {
                    // Si hay una imagen subida, subirla a Azure Blob Storage
                    imageUrl = await uploadImage(req.file); // Subir la imagen y obtener la URL
                }

                // Crear el evento con la URL de la imagen si está disponible
                const newEvent = await prisma.event.create({
                    data: {
                        name: String(name),
                        date: new Date(date),
                        location: String(location),
                        description: String(description),
                        school_id: Number(schoolId) ,
                        imageUrl, // Guardar la URL de la imagen si está presente
                    },
                });

                res.status(201).json(newEvent);
            } catch (error) {
                console.error('Error adding event:', error);
                res.status(500).json({ error: 'Error adding event' });
            } finally {
                await prisma.$disconnect();
              }
        });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}