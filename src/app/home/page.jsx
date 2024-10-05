// src/app/home/page.jsx
'use client';


import { useEffect, useState } from 'react';
import CameraFedd from '../../components/CameraFeed';

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
      <CameraFedd />
    </div>
  );
};

export default HomePage;