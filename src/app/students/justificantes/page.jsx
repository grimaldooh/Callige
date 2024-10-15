// pages/students/justificantes/index.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation'; // Si el ID del estudiante está en la URL, si no puedes usar el ID directamente.

const studentId = 14; // Reemplazar con el ID del estudiante

const formattedDate = (fecha) => {
  const date = new Date(fecha);
  const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return adjustedDate.toLocaleDateString();
};

const JustificantesPage = () => {
  const [justificantes, setJustificantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJustificantes = async () => {
      try {
        const response = await axios.get(`/api/student/justificante`, {
          params: { studentId },
        });
        setJustificantes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching justificantes:', error);
        setLoading(false);
      }
    };

    fetchJustificantes();
  }, []);

  if (loading) return <p>Cargando justificantes...</p>;

  const justificantesPendientes = justificantes.filter((j) => j.status === 1);
  const justificantesAprobados = justificantes.filter((j) => j.status === 2);
  const justificantesRechazados = justificantes.filter((j) => j.status === 3);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Justificantes</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pendientes</h2>
        {justificantesPendientes.length > 0 ? (
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Razón</th>
                <th className="px-4 py-2">Grupo</th>
              </tr>
            </thead>
            <tbody>
              {justificantesPendientes.map((j) => (
                <tr key={j.id}>
                  <td className="border px-4 py-2">{formattedDate(j.fecha)}</td>
                  <td className="border px-4 py-2">{j.razon}</td>
                  <td className="border px-4 py-2">{j.group?.name || j.group_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay justificantes pendientes.</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Aprobados</h2>
        {justificantesAprobados.length > 0 ? (
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Razón</th>
                <th className="px-4 py-2">Grupo</th>
              </tr>
            </thead>
            <tbody>
              {justificantesAprobados.map((j) => (
                <tr key={j.id}>
                  <td className="border px-4 py-2">{formattedDate(j.fecha)}</td>
                  <td className="border px-4 py-2">{j.razon}</td>
                  <td className="border px-4 py-2">{j.group?.name || j.group_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay justificantes aprobados.</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Rechazados</h2>
        {justificantesRechazados.length > 0 ? (
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Razón</th>
                <th className="px-4 py-2">Grupo</th>
              </tr>
            </thead>
            <tbody>
              {justificantesRechazados.map((j) => (
                <tr key={j.id}>
                  <td className="border px-4 py-2">{formattedDate(j.fecha)}</td>
                  <td className="border px-4 py-2">{j.razon}</td>
                  <td className="border px-4 py-2">{j.group?.name || j.group_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay justificantes rechazados.</p>
        )}
      </div>
    </div>
  );
};

export default JustificantesPage;