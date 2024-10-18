import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { teacherId } = req.query;
    console.log('teacherId:', teacherId);

    try {
        // Obtener los grupos del profesor utilizando la relación muchos a muchos
        const groups = await prisma.group.findMany({
            where: {
                teachers: {
                    some: {
                        id: parseInt(teacherId),
                    },
                },
            },
            include: {
                justificantes: {
                    where: {
                        status: 2, // Solo justificantes pendientes
                    },
                    include: {
                        student: true,
                        group: true,
                    },
                },
            },
        });

        console.log('groups:', groups);

        // Extraer los justificantes pendientes
        const justificantes = groups.flatMap(group => group.justificantes);
        console.log('justificantes:', justificantes);
        res.status(200).json({ justificantes });
    } catch (error) {
        console.error('Error fetching justificantes:', error);
        res.status(500).json({ error: 'Error fetching justificantes' });
    }
}