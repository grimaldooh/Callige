import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
      const { groupId, studentId } = req.body;
  
      try {
        // Desvincular al estudiante
        if (studentId) {
          // Eliminar asistencias asociadas al estudiante en el grupo
          await prisma.attendance.deleteMany({
            where: {
              student_id: studentId,
              attendanceList: {
                group_id: groupId,
              },
            },
          });
    
          // Desvincular al estudiante del grupo
          await prisma.group.update({
            where: { id: groupId },
            data: {
              students: {
                disconnect: { id: studentId },
              },
            },
          });
        }
  
        return res.status(200).json({ message: 'Estudiante desvinculado correctamente' });
      } catch (error) {
        console.error('Error desvinculando estudiante:', error);
        return res.status(500).json({ message: 'Error al desvincular estudiante' });
      } finally {
        await prisma.$disconnect();
      }
    }
  
    return res.status(405).json({ message: 'Método no permitido' });
  }