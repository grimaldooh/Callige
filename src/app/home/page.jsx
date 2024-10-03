// src/app/home/page.jsx
'use client';

import { useEffect, useState } from 'react';

const HomePage = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error('Error al obtener los estudiantes', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Bienvenido al sistema de gestión de estudiantes</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id}>{student.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;