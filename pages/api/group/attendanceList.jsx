import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { groupId } = req.query;

  if (!groupId) {
    return res.status(400).json({ error: 'groupId is required' });
  }

  try {
    // Obtener la lista de asistencia más reciente para el grupo con el ID más alto
    const latestAttendanceList = await prisma.attendanceList.findFirst({
      where: {
        group_id: parseInt(groupId),
      },
      orderBy: {
        id: 'desc', // Orden descendente para obtener el ID más alto
      },
      include: {
        attendances: {
          include: {
            student: true, // Incluye datos del estudiante en cada asistencia
          },
        },
      },
    });

    if (!latestAttendanceList) {
      return res.status(404).json({ error: 'No attendance list found for the specified group' });
    }

    // Formatear la respuesta para incluir el estado de asistencia de cada estudiante
    const attendanceData = latestAttendanceList.attendances.map((attendance) => ({
      attendanceId: attendance.id, 
      studentId: attendance.student.id,
      studentName: attendance.student.name,
      present: attendance.present,
    }));

    res.status(200).json({ attendanceListId: latestAttendanceList.id, attendanceData });
  } catch (error) {
    console.error('Error fetching attendance list:', error);
    res.status(500).json({ error: 'Error fetching attendance list' });
  } finally {
    await prisma.$disconnect();
  }
}