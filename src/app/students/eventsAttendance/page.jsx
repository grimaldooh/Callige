// src/pages/attendancePage.jsx
'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

function AttendancePage() {
  const { userId: studentId } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!studentId) return;
    async function fetchAttendance() {
      try {
        const response = await fetch(`/api/student/getEventsAttendance?studentId=${studentId}`);
        const data = await response.json();
        setEvents(data.events);
        console.log('events:', data.events);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    }

    fetchAttendance();
  }, [studentId]);

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="text-2xl font-bold mt-4">Historial de Asistencias</h1>

      {events.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full mt-8 border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Nombre del Evento</th>
                <th className="px-4 py-2">Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="border-b border-gray-200">
                  <td className="px-4 py-2">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{event.name}</td>
                  <td className="px-4 py-2">
                    {event.attended ? (
                      <span className="text-green-500 font-semibold">Presente</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Ausente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4">No hay eventos de asistencia para mostrar.</p>
      )}
    </div>
  );
}

export default AttendancePage;