import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { schoolId } = req.query;
  console.log(schoolId)

  if (req.method === 'GET') {
    try {
      const school = await prisma.school.findUnique({
        where: { id: parseInt(schoolId) },
      });
      if (!school) return res.status(404).json({ error: 'School not found' });
      res.status(200).json(school);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching school data' });
    }
  } else if (req.method === 'PUT') {
    const { schoolId } = req.query;
    const { startDate, endDate } = req.body;

    try {
      const updatedSchool = await prisma.school.update({
        where: { id: parseInt(schoolId) },
        data: { startDate: new Date(startDate), endDate: new Date(endDate) },
      });
      res.status(200).json(updatedSchool);
    } catch (error) {
      res.status(500).json({ error: 'Error updating school' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}