import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const students = await prisma.student.findMany();
      res.status(200).json({ students });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching students' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body; // Obtener el ID del estudiante
    try {
      await prisma.student.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: 'Estudiante eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar estudiante' });
    }
  } else if (req.method === 'PUT') {
    const { updatedStudent } = req.body; // Obtener los datos del estudiante a editar
    console.log('updatedStudent:', updatedStudent );
    //const id = updatedStudent.id;
    const { id, name, email } = updatedStudent;
    console.log('name:', name);
    console.log('id:', id);
    try {
      const updatedStudent = await prisma.student.update({
        where: { id: Number(id) },
        data: { name, email },
      });
      console.log('updatedStudent:', updatedStudent);
      res.status(200).json({ updatedStudent });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ error: 'Error al actualizar estudiante' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}