// components/AttendanceList.js
'use client'
import React, { useEffect, useState } from 'react';

const AttendanceList = ({ eventId, showModal }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  useEffect(() => {
    const fetchAttendanceList = async () => {
      try {
        const response = await fetch(`/api/event/attendanceList?eventId=${eventId}`);
        const data = await response.json();
        if (response.ok) {
          setAttendanceData(data.attendances || []);
        } else {
          setError(data.error || 'Error al cargar la lista de asistencia');
        }
      } catch (error) {
        setError('Error al conectar con la API');
      }
    };

    fetchAttendanceList();
  }, [eventId]);

  if (error) {
    return <p>{error}</p>;
  }

  const handleAttendanceClick = (attendance) => {
    console.log('attendance:', attendance);
    setSelectedAttendance(attendance);
    setShowConfirmModal(true);
  };

  const handleConfirmChange = async () => {
    if (!selectedAttendance) return;

    try {
      const response = await fetch('/api/event/updateAttendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendanceId: selectedAttendance.id }),
      });

      if (response.ok) {
        const updatedAttendance = await response.json();
        setAttendanceData((prevData) =>
          prevData.map((att) =>
            att.id === updatedAttendance.id ? { ...att, present: updatedAttendance.present } : att
          )
        );
        setShowConfirmModal(false);
        setSelectedAttendance(null);
      } else {
        console.error('Error al actualizar la asistencia');
      }
    } catch (error) {
      console.error('Error al conectar con la API');
    }
  };

  const handleCloseModal = () => {
    showModal(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Lista de Asistencia</h2>
          <button
            onClick={handleCloseModal}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            Cerrar
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Estudiante</th>
              <th className="py-2 px-4 border-b text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((attendance) => (
              <tr key={attendance.id}>
                <td className="py-2 px-4 border-b border-r">
                  {attendance.student.name}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleAttendanceClick(attendance)}
                    className={`${
                      attendance.present ? 'text-green-500' : 'text-red-500'
                    } font-bold`}
                  >
                    {attendance.present ? 'Presente' : 'Ausente'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3">
            <h3 className="text-xl font-semibold mb-4">¿Confirmar cambio de asistencia?</h3>
            <p className="mb-4">
              {`¿Quieres marcar a ${selectedAttendance.student.name} como ${
                selectedAttendance.present ? 'Ausente' : 'Presente'
              }?`}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmChange}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;