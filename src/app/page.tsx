"use client"; // Asegura que el código es compatible con Next.js

import { useEffect, useState } from 'react';
import CameraFedd from '../components/CameraFeed';

export default function HomePage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

 

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Lista de Estudiantes</h1>
      <CameraFedd />
      hola
    </div>
  );
}
