// pages/students/groups/[groupId]/page.tsx
'use client'

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation'; // Usamos useParams
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { format } from 'date-fns';


const MAX_ABSENCES = 20;

const GroupAttendancePage = () => {
  const { groupId } = useParams(); // Obtener el ID del grupo
  const studentId = 14; // Usar el ID del estudiante

  const [attendances, setAttendances] = useState([]);
  const [absencePercentage, setAbsencePercentage] = useState(0);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await axios.get("/api/student/attendance", {
          params: {
            groupId,
            studentId,
          },
        });
        const { data } = response;

        setAttendances(data.attendances);
        console.log("attendances:", data.attendances);
        setAbsencePercentage(data.absencePercentage*5);
      } catch (error) {
        console.error("Error fetching attendances:", error);
      }
    };

    fetchAttendances();
  }, [groupId]);

  const absenceColor = getAbsenceColor(absencePercentage);

  
  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const formattedDate = adjustedDate.toLocaleDateString();
    return formattedDate;
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mt-20 mb-4">
        Asistencias del Grupo {groupId}
      </h1>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">
          Porcentaje de Inasistencias
        </h2>
        <div
          className={`w-16 h-16 mt-10 rounded-full ${absenceColor} flex items-center justify-center`}
        >
          <span className="text-white text-center block">
            {absencePercentage}%
          </span>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Asistencias</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((att) => (
              <tr key={att.id}>
                <td className="border px-4 py-2">
                  {formattedDate(att.attendanceList.fecha)}
                </td>
                <td className={`border px-4 py-2 ${att.present ? 'bg-green-200' : 'bg-red-200'}`}>
                    {att.present ? "Asistió" : "Faltó"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function getAbsenceColor(absencePercentage) {
  if (absencePercentage <= 25) {
    return "bg-green-500"; // Verde
  } else if (absencePercentage <= 75) {
    return "bg-orange-500"; // Naranja
  } else {
    return "bg-red-500"; // Rojo
  }
}

export default GroupAttendancePage;