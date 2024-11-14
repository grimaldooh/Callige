// pages/students/groups/[groupId]/page.tsx
'use client'

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation'; // Usamos useParams
import axios from "axios";
import JustificationModal from "../../../../../components/ModalAddJustificante";
import {useAuth} from '../../../../context/AuthContext'
import { parse } from "path";

const GroupAttendancePage = () => {
  const { groupId } = useParams(); // Obtener el ID del grupo
  const [studentId, setStudentId] = useState();
  const { tempStudentId} = useAuth();
  console.log('tempstudent', localStorage.getItem('tempStudentId'))
  const [currentAttendanceId, setCurrentAttendanceId] = useState();
  const [attendances, setAttendances] = useState([]);
  const [absencePercentage, setAbsencePercentage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [group, setGroup] = useState(null);
  const [absences, setAbsences] = useState(0);
  const [absenceColor, setAbsenceColor] = useState("bg-green-500");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setStudentId(parseInt(localStorage.getItem('tempStudentId')));
    console.log('studentId:', studentId);
    }, [studentId]);

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
        setAbsences(data.absences);
        console.log("attendances:", data.attendances);
      } catch (error) {
        console.error("Error fetching attendances:", error);
      }
    };

    const fetchGroup = async () => {
      try {
        const response = await axios.get(`/api/admin/findGroup?id=${groupId}`);
        const data = response.data;
        setGroup(data);
        console.log('Group data:', data);
      } catch (error) {
        console.error('Error fetching group:', error);
      }
    };

    if (groupId && studentId) {
      fetchGroup();
      fetchAttendances();
      setIsLoading(false);
    }
  }, [groupId, studentId]);

  useEffect(() => {
    if (!group) return;
    const percentage = (absences / (group.max_absences )) * 100;
    setAbsencePercentage(Math.round(percentage));
  }, [absences, group]);

  useEffect(() => {
    setAbsenceColor(getAbsenceColor(absencePercentage));
  }, [absencePercentage]);

  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const formattedDate = adjustedDate.toLocaleDateString();
    return formattedDate;
  };

  const openJustificationModal = (fecha, attendanceId) => {
    setCurrentAttendanceId(attendanceId);
    setSelectedDate(fecha);
    setIsModalOpen(true);
  };

  const closeJustificationModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mt-16 mb-6 text-center text-gray-900">
        {group
          ? `Asistencias del Grupo de ${group.name}`
          : "Cargando datos del grupo..."}
      </h1>

      <div className="mt-8 px-4 flex flex-col items-center bg-white rounded-lg shadow-md py-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Porcentaje de Inasistencias
        </h2>

        <div
          className={`w-20 h-20 rounded-full ${absenceColor} flex items-center justify-center shadow-lg`}
        >
          <span className="text-white text-xl font-medium">
            {absencePercentage}%
          </span>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {group
              ? `Faltas en el semestre: ${absences} / ${group.max_absences}`
              : "Cargando datos del grupo..."}
          </p>
          <p className="mt-2 text-gray-500">
            {group ? `Número máximo de faltas: ${group.max_absences}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Lista de Asistencias
        </h2>
        <div className="overflow-x-auto px-4">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold whitespace-nowrap">
                <th className="py-4 px-6 text-left">Fecha</th>
                <th className="py-4 px-6 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {Array.isArray(attendances) && attendances.length > 0 ? (
                attendances.map((att) => (
                  <tr
                    key={att.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-6 text-left">
                      {formattedDate(att.attendanceList.fecha)}
                    </td>
                    <td
                      className={`py-3 px-6 text-left rounded-lg font-medium ${
                        att.present === 1
                          ? "bg-green-50 text-green-700"
                          : att.present === 2
                          ? "bg-yellow-50 text-yellow-700"
                          : att.present === 3 || att.present === 0
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {att.present === 1
                        ? "Asistió"
                        : att.present === 2
                        ? "Justificación en proceso"
                        : "Faltó"}
                      {att.present === 0 && (
                        <></>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">
                    No hay registros de asistencia disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
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