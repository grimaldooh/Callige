import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del header

    if (!token) {
      return res.redirect('/auth/login');
    }
    const { schoolId } = req.query; // Obtener el schoolId de la query
    console.log('schoolId:', schoolId);

    if (!schoolId) {
      return res.status(400).json({ error: 'School ID is required' });
    }

    try {
      const totalStudents = await prisma.student.count({
        where: { school_id: parseInt(schoolId) }, // Filtrar por schoolId
      });
      const totalTeachers = await prisma.teacher.count({
        where: { school_id: parseInt(schoolId) }, // Filtrar por schoolId
      });
      const totalGroups = await prisma.group.count({
        where: { school_id: parseInt(schoolId) }, // Filtrar por schoolId
      });

      const totalAdmins = await prisma.admin.count({
        where: { school_id: parseInt(schoolId) }, // Filtrar por schoolId
      });
      console.log('totalAdmins:', totalAdmins);

      console.log('totalStudents:', totalStudents);

      res.status(200).json({ totalStudents, totalTeachers, totalGroups });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching statistics' });
      console.error('Error fetching statistics:', error);
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}