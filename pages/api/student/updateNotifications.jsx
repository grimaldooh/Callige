// pages/api/student/updateNotifications.js
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { studentId, enableNotifications } = req.body;
    try {
      await prisma.student.update({
        where: { id: parseInt(studentId) },
        data: { enableNotifications },
      });
      res.status(200).json({ message: 'Notificaciones actualizadas correctamente' });
    } catch (error) {
      console.error('Error al actualizar notificaciones:', error);
      res.status(500).json({ error: 'Error al actualizar notificaciones' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}