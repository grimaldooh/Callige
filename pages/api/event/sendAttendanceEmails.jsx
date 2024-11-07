import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { attendanceData } = req.body;
  console.log('attendanceData:', attendanceData);
 
  // Configura el transporte de nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // o usa otro proveedor de email
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Envía un correo a cada asistente
  try {
    await Promise.all(
      attendanceData.map(async (attendance) => {
        const { email } = attendance.student;
        const asistenciaEstado = attendance.present ? 'asistió' : 'no asistió';

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Resumen de Asistencia al Evento`,
          html: `
            <p>Hola <strong>${attendance.student.name}</strong>,</p>
            <p>Te informamos que <strong>${asistenciaEstado}</strong> al evento.</p>
            <p>Si no has sido registrado correctamente, por favor contacta con uno de los responsables del evento.</p>
            <p>Saludos,<br>Equipo del Evento</p>
          `,
        };

        await transporter.sendMail(mailOptions);
      })
    );

    res.status(200).json({ message: 'Correos enviados exitosamente' });
  } catch (error) {
    console.error('Error enviando correos:', error);
    res.status(500).json({ error: 'Error al enviar correos' });
  }
}