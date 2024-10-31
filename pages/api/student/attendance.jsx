// pages/api/student/getAttendances.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { studentId, groupId } = req.query;

    if (!studentId || !groupId) {
      return res.status(400).json({ error: 'Student ID and Group ID are required' });
    }

    try {
      const attendances = await prisma.attendance.findMany({
        where: {
          student_id: parseInt(studentId, 10),
          attendanceList: {
            group_id: parseInt(groupId, 10),
          },
        },
        include: {
          attendanceList: true,
        },
        orderBy: {
          attendanceList: {
            fecha: 'asc',
          },
        },
      });
      console.log('attendances:', attendances);
      // Calcular el porcentaje de inasistencias
      const absences = attendances.filter(att => att.present === 0 || att.present === 3).length;
      const absencePercentage = (absences / 20) * 100;

      res.status(200).json({
        attendances,
        absencePercentage: Math.min(absencePercentage, 100), // Asegurar que el porcentaje no sea mayor al 100%
        absences,
      });
    } catch (error) {
      console.error('Error fetching attendances:', error);
      res.status(500).json({ error: 'Error fetching attendances' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}