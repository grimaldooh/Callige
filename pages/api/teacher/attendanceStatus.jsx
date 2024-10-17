import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    console.log('Request received:', req.method);
    console.log('req.body:', req.body);

    if (req.method !== 'POST') {
        console.log('Invalid request method:', req.method);
        return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    const { justificanteId, action } = req.body;
    console.log('justificanteId:', justificanteId);
    console.log('action:', action);

    if (!justificanteId || !action) {
        console.log('Missing required parameters');
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        console.log('Searching for justificante with ID:', justificanteId);

        // Buscar el justificante con el ID proporcionado
        const justificante = await prisma.justificante.findUnique({
            where: { id: justificanteId },
            include: { attendance: true},
        });

        console.log('Justificante found:', justificante);

        if (!justificante) {
            console.log('Justificante not found');
            return res.status(404).json({ error: 'Justificante not found' });
        }

        // Determinar el valor de "present" según la acción
        let newStatus;
        if (action === 'approved') {
            newStatus = 1; // Aprobado
            console.log('Action approved, setting newStatus to 2');
        } else if (action === 'rejected') {
            newStatus = 3; // Rechazado
            console.log('Action rejected, setting newStatus to 3');
        } else {
            console.log('Invalid action:', action);
            return res.status(400).json({ error: 'Invalid action' });
        }

        console.log('Updating attendance status for ID:', justificante.attendance_id);

        // Actualizar el estado de la asistencia asociada
        await prisma.attendance.update({
            where: { id: justificante.attendance_id },
            data: { present: newStatus },
        });

        console.log('Attendance status updated successfully');

        console.log('Updating justificante status for ID:', justificanteId);

        // Actualizar el status del justificante
        await prisma.justificante.update({
            where: { id: justificanteId },
            data: { status: newStatus },
        });

        console.log('Justificante status updated successfully');

        res.status(200).json({ message: 'Attendance status updated successfully' });
    } catch (error) {
        console.error('Error updating attendance status:', error);
        res.status(500).json({ error: 'Error updating attendance status' });
    }
}