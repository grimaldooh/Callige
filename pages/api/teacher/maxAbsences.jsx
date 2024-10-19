// /pages/api/teacher/maxAbsences.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {

  if (req.method === 'PUT') {
    const { max_absences, groupId } = req.body;
    console.log('max_absences:', max_absences);
    console.log('groupId:', groupId);
    try {
      const updatedGroup = await prisma.group.update({
        where: { id: parseInt(groupId) },
        data: { max_absences: parseInt(max_absences) },
      });
      res.status(200).json(updatedGroup);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating max absences' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}