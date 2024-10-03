// src/services/students.js
const pool = require('../lib/db');

// Función para obtener todos los estudiantes
export async function getAllStudents() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM students');
    return result.rows;
  } finally {
    client.release();
  }
}

 