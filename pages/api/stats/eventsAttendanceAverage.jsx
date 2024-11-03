import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { schoolId } = req.query;
  console.log('schoolId:', schoolId);

  if (!schoolId) {
    return res.status(400).json({ error: 'schoolId is required' });
  }

  try {
    const events = await prisma.event.findMany({
      where: { school_id: parseInt(schoolId) },
      include: {
        attendanceList: {
          include: {
            attendances: true
          }
        }
      }
    });

    const eventAttendanceData = events.map((event) => {
      const totalAttendees = event.attendanceList?.attendances.length || 0;
      const attendedCount = event.attendanceList?.attendances.filter(
        (attendance) => attendance.present === 1
      ).length || 0;
      const attendancePercentage = totalAttendees > 0 
        ? ((attendedCount / totalAttendees) * 100).toFixed(2) 
        : 0;

      return {
        id: event.id,
        name: event.name,
        date: event.date,
        totalAttendees,
        attendedCount,
        attendancePercentage
      };
    });

    res.status(200).json(eventAttendanceData);
  } catch (error) {
    console.error('Error fetching event attendance data:', error);
    res.status(500).json({ error: 'An error occurred while fetching event attendance data.' });
  }
}