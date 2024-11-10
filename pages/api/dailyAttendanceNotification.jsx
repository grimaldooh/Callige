import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import dotenv from 'dotenv';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

dotenv.config(); // Cargar variables de entorno

// Configuración de nodemailer para enviar correos
const transporter = nodemailer.createTransport({
  service: 'gmail', // o tu proveedor de correo
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Función para obtener las asistencias y enviar correos
const sendAttendanceSummaryEmails = async () => {

  try {
    // Obtén la fecha de hoy en la zona horaria de Tijuana
    const timeZone = 'America/Tijuana';
    const now = new Date();
    const today = toZonedTime(now, timeZone);
    today.setHours(0, 0, 0, 0);

    const addedSubjects = new Set();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    console.log('Hoy:', today);
    console.log('yesterdat:', yesterday);

    const pastYesterday = new Date(today);
    pastYesterday.setDate(today.getDate() - 2);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Formatea las fechas para asegurarte de que están en la zona horaria correcta
    const formattedToday = formatInTimeZone(today, timeZone, 'yyyy-MM-dd HH:mm:ssXXX');
    const formattedYesterday = formatInTimeZone(yesterday, timeZone, 'yyyy-MM-dd HH:mm:ssXXX');
    const formattedTomorrow = formatInTimeZone(tomorrow, timeZone, 'yyyy-MM-dd HH:mm:ssXXX');

    console.log('Hoy:', formattedToday);
    console.log('Ayer:', formattedYesterday);
    console.log('Mañana:', formattedTomorrow);

    // Obtiene todas las listas de asistencia de hoy
    const attendancelists = await prisma.attendanceList.findMany({
      where: {
        fecha: {
          gt: yesterday,
        },
      },
      include: {
        attendances: {
          include: {
            student: true,
          },
        },
      },
    }); 

    console.log('Listas de asistencias:', attendancelists);

    // Obtiene todos los estudiantes con notificaciones activadas y sus asistencias de hoy
    const students = await prisma.student.findMany({
      where: { enableNotifications: true },
      include: {
        attendances: {
          where: {
            attendanceList: {
              fecha: {
                gt: yesterday,
              },
            },
          },
          include: {
            attendanceList: {
                include: {
                    grupo: true,
                }
            }
          },
        },
      },
    });

    console.log('Estudiantes con notificaciones activadas:', students);

    // Procesa cada estudiante y envía su resumen
    for (const student of students) {
      if (student.attendances.length > 0) {
        let attendanceSummary = `
          <p>Buenas noches, <strong>${student.name}</strong></p>
          <p>Aquí está tu resumen de asistencias de hoy:</p>
          <ul>
        `;

        // Añade cada asistencia al resumen
        for (const attendance of student.attendances) {
          const subject = attendance.attendanceList.grupo.name || "Materia no especificada";
          const status = attendance.present ? "Asistió" : "Ausente";
          if (!addedSubjects.has(subject)) {
            attendanceSummary += `<li><strong>${subject}</strong>: ${status}</li>`;
            addedSubjects.add(subject); // Añade el nombre de la materia al conjunto
          }
        }

        attendanceSummary += `
          </ul>
          <p>Si alguna asistencia no es correcta, puedes elaborar un justificante en la aplicación o hablar con tu profesor de clase sobre el problema.</p>
          <p>Saludos,<br>Callige</p>
        `;

        // Configuración del correo
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: 'Resumen de asistencias de hoy',
          html: attendanceSummary,
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${student.email}`);
      }
    }
  } catch (error) {
    console.error('Error enviando correos de resumen de asistencias:', error);
    throw new Error('Error al enviar correos');
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      await sendAttendanceSummaryEmails(); // Llama a la función que envía los correos
      res.status(200).json({ message: 'Correos enviados exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al enviar correos' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}