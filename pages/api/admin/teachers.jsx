import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { schoolId } = req.query; // Obtener el schoolId de la query

    try {
      const teachers = await prisma.teacher.findMany({
        where : {
          school_id: parseInt(schoolId),
        },
      });
      res.status(200).json({ teachers });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching students' });
    } finally {
      await prisma.$disconnect();
    }
  }  else if (req.method === 'DELETE') {
    const { id } = req.body; // Obtener el ID del estudiante
    console.log('id:', id);
    try {
      await prisma.teacher.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: 'Profesor eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar profesor' });
    } finally {
      await prisma.$disconnect();
    }
  } 
  else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
