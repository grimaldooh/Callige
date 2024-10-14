import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Buscar la lista de asistencia con el id más alto para el grupo 7
      const attendanceList = await prisma.attendanceList.findFirst({
        where: { group_id: 7 },
        orderBy: { id: 'desc' },  // Ordenar por id descendente para obtener el último registro
        include: {
          attendances: {
            include: {
              student: true,  // Incluir detalles de los estudiantes
            },
          },
        },
      });

      console.log('Attendance list fetched:', attendanceList);

      if (!attendanceList) {
        console.log('No attendance list found for group 7.');

        return res.status(404).json({ message: 'No se encontró la lista de asistencia.' });
      }

      // Formatear los datos para el frontend
      const formattedAttendance = attendanceList.attendances.map(attendance => ({
        id: attendance.student.id,
        name: attendance.student.name,
        present: attendance.present,
      }));

      res.status(200).json({ attendance: formattedAttendance });
    } catch (error) {
      console.error('Error fetching attendance list:', error);
      res.status(500).json({ error: 'Error fetching attendance list' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}