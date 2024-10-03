// src/services/students.js
const pool = require('../lib/db');

// Función para obtener todos los estudiantes
export async function getAllTeachers() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM teachers');
    return result.rows;
  } finally {
    client.release();
  }
}

 