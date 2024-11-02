// pages/api/attendance/updateStatus.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { attendanceId } = req.body;

  if (!attendanceId) {
    return res.status(400).json({ error: 'El ID de la asistencia es requerido.' });
  }

  try {
    const attendance = await prisma.attendance.findUnique({ where: { id: attendanceId } });
    if (!attendance) {
      return res.status(404).json({ error: 'No se encontró la asistencia.' });
    }

    // Cambia el estado de 'present' (0 -> ausente, 1 -> presente)
    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: { present: attendance.present === 1 ? 0 : 1 },
    });

    res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error('Error al actualizar el estado de asistencia:', error);
    res.status(500).json({ error: 'Error al actualizar el estado de asistencia' });
  }
}