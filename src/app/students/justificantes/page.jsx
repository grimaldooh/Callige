// pages/students/justificantes/index.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation'; // Si el ID del estudiante está en la URL, si no puedes usar el ID directamente.
import { useAuth } from '@/app/context/AuthContext';



const formattedDate = (fecha) => {
  const date = new Date(fecha);
  const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return adjustedDate.toLocaleDateString();
};

const JustificantesPage = () => {
  const { userId } = useAuth();
  const studentId = userId;
  console.log('studentId:', studentId);
  const [justificantes, setJustificantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return; // No hacer nada si no hay studentId
    
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
  }, [studentId]);

  if (loading) return <p>Cargando justificantes...</p>;

  const justificantesPendientes = justificantes.filter((j) => j.status === 2);
  const justificantesAprobados = justificantes.filter((j) => j.status === 1);
  const justificantesRechazados = justificantes.filter((j) => j.status === 3);

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Justificantes</h1>
  
      {/* Sección de justificantes pendientes */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-yellow-500 mb-6">Pendientes</h2>
        {justificantesPendientes.length > 0 ? (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b">
                  <th className="px-6 py-3 text-left text-sm font-medium">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Razón</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {justificantesPendientes.map((j) => (
                  <tr key={j.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{formattedDate(j.fecha)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{j.razon}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{j.group?.name || j.group_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic mt-4">No hay justificantes pendientes.</p>
        )}
      </div>
  
      {/* Sección de justificantes aprobados */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-green-500 mb-6">Aprobados</h2>
        {justificantesAprobados.length > 0 ? (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b">
                  <th className="px-6 py-3 text-left text-sm font-medium">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Razón</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {justificantesAprobados.map((j) => (
                  <tr key={j.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{formattedDate(j.fecha)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{j.razon}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{j.group?.name || j.group_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic mt-4">No hay justificantes aprobados.</p>
        )}
      </div>
  
      {/* Sección de justificantes rechazados */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-red-500 mb-6">Rechazados</h2>
        {justificantesRechazados.length > 0 ? (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b">
                  <th className="px-6 py-3 text-left text-sm font-medium">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Razón</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {justificantesRechazados.map((j) => (
                  <tr key={j.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{formattedDate(j.fecha)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{j.razon}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{j.group?.name || j.group_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic mt-4">No hay justificantes rechazados.</p>
        )}
      </div>
    </div>
  );
}

export default JustificantesPage;