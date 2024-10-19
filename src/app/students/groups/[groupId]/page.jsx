// pages/students/groups/[groupId]/page.tsx
'use client'

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation'; // Usamos useParams
import axios from "axios";
import JustificationModal from "../../../../components/ModalAddJustificante";
import { useAuth } from "@/app/context/AuthContext";

const GroupAttendancePage = () => {
  const { groupId } = useParams(); // Obtener el ID del grupo
  const { userId: studentId } = useAuth();
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
    setAbsencePercentage(percentage);
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

  const handleJustificationSubmit = async ({ reason, description, image }) => {
    try {
      // Crear un objeto FormData para enviar los datos del formulario, incluyendo la imagen
      const formData = new FormData();
      formData.append('reason', reason);
      formData.append('description', description);
      formData.append('studentId', studentId);
      formData.append('groupId', groupId);
      formData.append('attendanceId', currentAttendanceId);
      formData.append('fecha', selectedDate);

      console.log('fecha:', selectedDate);
      console.log('groupId:', groupId);
      console.log('studentId:', studentId);
      console.log('attendanceId:', currentAttendanceId);
      if (image) {
        formData.append('image', image); // Agregar la imagen al formData si está disponible
      }

      // Realizar la petición POST al API
      const response = await fetch('/api/justificantes', {
        method: 'POST',
        body: formData, // Enviar el FormData como cuerpo de la petición
      });

      if (!response.ok) {
        throw new Error('Error al enviar el justificante');
      }

      // Mostrar una respuesta de éxito o manejar el estado
      const data = await response.json();
      console.log('Justificante enviado exitosamente:', data);
      alert('Justificante enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el justificante:', error);
      alert('Hubo un error al enviar el justificante. Intente de nuevo.');
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mt-20 mb-4">
        {group
          ? `Asistencias del Grupo de ${group.name}`
          : "Cargando datos del grupo..."}
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
        <p className="mt-4 text-gray-700">
          {group
            ? `Faltas en el semestre : ${absences} / ${group.max_absences}`
            : "Cargando datos del grupo..."}
        </p>
        <p className="mt-4 text-gray-700">
          {group
            ? `Número máximo de faltas: ${group.max_absences}`
            : "Cargando datos del grupo..."}
        </p>
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
            {Array.isArray(attendances) && attendances.length > 0 ? (
              attendances.map((att) => (
                <tr key={att.id}>
                  <td className="border px-4 py-2">
                    {formattedDate(att.attendanceList.fecha)}
                  </td>
                  <td
                    className={`border px-4 py-2 ${
                      att.present === 1
                        ? "bg-green-200"
                        : att.present === 2
                        ? "bg-blue-200"
                        : att.present === 3
                        ? "bg-red-200"
                        : att.present === 0
                        ? "bg-red-200"
                        : ""
                    }`}
                  >
                    {att.present === 1
                      ? "Asistió"
                      : att.present === 2
                      ? "Justificación en proceso"
                      : att.present === 3
                      ? "Faltó"
                      : att.present === 0
                      ? "Faltó"
                      : "N/A"}
                    {att.present === 0 && (
                      <button
                        className="ml-4 bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() =>
                          openJustificationModal(
                            att.attendanceList.fecha,
                            att.id
                          )
                        }
                      >
                        Solicitar Justificante
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center text-gray-600">
                  No hay registros de asistencia disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Modal */}
        <JustificationModal
          isOpen={isModalOpen}
          onClose={closeJustificationModal}
          onSubmit={handleJustificationSubmit}
        />
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