// pages/api/group/updateImage.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadImage } = require('../../../azure/blob'); // Importa la función de Azure

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('image')(req, res, async (err) => {
      if (err) return res.status(500).json({ error: 'Error uploading file' });

      const { groupId } = req.body;
      if (!groupId) return res.status(400).json({ error: 'Group ID is required' });

      try {
        let imageUrl = null;
        if (req.file) {
          imageUrl = await uploadImage(req.file); // Subir imagen y obtener URL
        }

        const updatedGroup = await prisma.group.update({
          where: { id: Number(groupId) },
          data: { imageUrl },
        });

        res.status(200).json(updatedGroup);
      } catch (error) {
        console.error('Error updating group image:', error);
        res.status(500).json({ error: 'Error updating group image' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}