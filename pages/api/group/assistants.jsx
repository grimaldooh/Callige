// src/pages/api/groups/assistants.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { groupId } = req.query;
  console.log('groupId:', groupId);

  if (req.method === 'GET') {
    try {
      const group = await prisma.group.findUnique({
        where: { id: parseInt(groupId) },
        include: {
          teachers: true,
          students: true,
        },
      });

      if (!group) {
        return res.status(404).json({ message: 'group no encontrado' });
      }

      res.status(200).json({
        teachers: group.teachers,
        students: group.students,
      });
    } catch (error) {
      console.error('Error fetching assistants:', error);
      res.status(500).json({ message: 'Error al obtener la lista de asistentes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}