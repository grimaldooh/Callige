import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../app/context/AuthContext';

const EventAttendanceAverage = () => {
  const { schoolId } = useAuth();
  const globalSchoolId = schoolId;
  const [eventAttendanceData, setEventAttendanceData] = useState([]);
  const [overallAttendancePercentage, setOverallAttendancePercentage] = useState(0);

  useEffect(() => {
    const fetchEventAttendanceData = async () => {
      try {
        const response = await axios.get(`/api/stats/eventsAttendanceAverage`, {
          params: { schoolId: globalSchoolId }
        });
        const eventsData = response.data;
        console.log('eventsData:', eventsData);

        // Calcular el porcentaje general de asistencia
        const totalEvents = eventsData.length;
        const sumOfPercentages = eventsData.reduce((sum, event) => sum + parseFloat(event.attendancePercentage), 0);
        const overallPercentage = totalEvents > 0 ? (sumOfPercentages / totalEvents).toFixed(2) : 0;

        setEventAttendanceData(eventsData);
        setOverallAttendancePercentage(overallPercentage);
      } catch (error) {
        console.error('Error fetching event attendance data:', error);
      }
    };
    
    fetchEventAttendanceData();
  }, [globalSchoolId]);

  return (
    <div className="container mx-auto p-8 mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Promedio de Asistencia por Evento</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-100 text-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Nombre del Evento</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Registrados</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Asistentes</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Porcentaje de Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {eventAttendanceData.map((event) => (
              <tr key={event.id} className="border-b border-gray-300">
                <td className="px-6 py-4 font-medium text-blue-900">{event.name}</td>
                <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{event.totalAttendees}</td>
                <td className="px-6 py-4">{event.attendedCount}</td>
                <td className="px-6 py-4">{Math.round(event.attendancePercentage)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">Porcentaje de Asistencia General</h3>
        <p className="text-4xl font-bold text-blue-900">{overallAttendancePercentage}%</p>
      </div>
    </div>
  );
};

export default EventAttendanceAverage;