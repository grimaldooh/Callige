// pages/api/attendance.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export default async function handler(req, res) {
  const { groupId } = req.query;
  console.log('groupId:', groupId);
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    console.log('GET');
    try {
      // Obtener las listas de asistencia para el grupo seleccionado
      const attendanceLists = await prisma.attendanceList.findMany({
        where: { group_id: parseInt(groupId) },
        include: {
          attendances: true, // Incluir asistencias relacionadas
        },
      });
        console.log('attendanceLists:', attendanceLists);
      res.status(200).json(attendanceLists);
    } catch (error) {
      console.error("Error fetching attendance lists:", error);
      res.status(500).json({ error: "Error fetching attendance lists" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}