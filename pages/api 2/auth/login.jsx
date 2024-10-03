// pages/api/auth/login.js
import { hash, compare } from 'bcryptjs'; // Para manejar contraseñas
import { getUserByEmail } from '../../../lib/db'; // Simulación de función para obtener usuario de la base de datos

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, name } = req.body;

  // Verificar que los campos no estén vacíos
  if (!email || !name) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    // Obtener el usuario por su email
    const user = await getUserByEmail(email); // Función que buscará al usuario en la base de datos

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña ingresada con la almacenada (usamos bcrypt para el hash)
    const isValidPassword = await compare(name, user.name);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Aquí puedes generar un token o sesión según sea necesario
    // Ejemplo: generar un JWT o establecer una cookie con la sesión

    return res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}