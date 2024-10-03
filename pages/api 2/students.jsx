// pages/api/students.js
import { getAllStudents } from '../../src/services/students';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const students = await getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}