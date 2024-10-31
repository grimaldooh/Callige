import { PrismaClient } from '@prisma/client';
const { uploadImage } = require('../../azure/blob');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Necesario para que multer maneje el request
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('req.body', req.body);
    upload.single('image')(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error uploading file' });
      }

      const { studentId, groupId, attendanceId, reason, description, fecha} = req.body;

      if (!studentId || !groupId || !reason || !description) {
        return res.status(400).json({ error: 'All fields except image are required' });
      }
      console.log('studentId:', studentId);
      console.log('groupId:', groupId);
      console.log('attendanceId:', attendanceId);

      try {
        let imageUrl = null;
        if (req.file) {
          imageUrl = await uploadImage(req.file);
        }

        const justificante = await prisma.justificante.create({
          data: {
            razon: reason,
            descripcion: description,
            fecha: new Date(fecha),
            student: { connect: { id: parseInt(studentId, 10) } },
            group: { connect: { id: parseInt(groupId, 10) } },
            attendance: { connect: { id: parseInt(attendanceId, 10) } },
            status: 2, //1 = aprobado, 2 = pendiente, 3 = rechazado
            imageUrl,
          },
        });

        const updatedAttendance = await prisma.attendance.update({
          where: { id: parseInt(attendanceId, 10) },
          data: { present: 2 }, // 2 en proceso de justificación
        });

        console.log('updatedAttendance:', updatedAttendance);
        console.log('justificante:', justificante);
        res.status(201).json(justificante);

      } catch (error) {
        console.error('Error creating justificante:', error); 
        res.status(500).json({ error: 'Error creating justificante' });
      } finally {
        await prisma.$disconnect();
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}