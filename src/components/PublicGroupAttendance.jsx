// components/AttendanceList.js
'use client'
import React, { useEffect, useState } from 'react';

const AttendanceList = ({ eventId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  useEffect(() => {
    const fetchAttendanceList = async () => {
      try {
        const response = await fetch(`/api/group/attendanceList?groupId=${eventId}`);
        const data = await response.json();
        console.log('data:', data);
        if (response.ok) {
            console.log('data:', data);
            setAttendanceData(data.attendanceData || []);
        } else {
          setError(data.error || 'Error al cargar la lista de asistencia');
        }
      } catch (error) {
        setError('Error al conectar con la API', error);
        console.error('Error al conectar con la API', error);
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
    console.log('selectedAttendance:', selectedAttendance);
    try {
      const response = await fetch('/api/teacher/updateAttendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendanceId: selectedAttendance.attendanceId }),
      });

      if (response.ok) {
        const updatedAttendance = await response.json();
        console.log('updatedAttendance:', updatedAttendance);
        console.log('attendanceData:', attendanceData);
        setAttendanceData((prevData) =>
            prevData.map((att) =>
              att.studentId === updatedAttendance.student_id
                ? { ...att, present: updatedAttendance.present }
                : att
            )
          );
        setShowConfirmModal(false);
        setSelectedAttendance(null);
      } else {
        console.error('Error al actualizar la asistencia');
      }
    } catch (error) {
      console.error('Error al conectar con la API', error);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Lista de Asistencia</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left text-sm font-semibold uppercase tracking-wider">Estudiante</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((attendance) => (
              <tr key={attendance.id} className="border-b border-gray-300">
                <td className="py-2 px-4 border-r">{attendance.studentName}</td>
                <td className="py-2 px-4">
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
              {`¿Quieres marcar a ${selectedAttendance.studentName} como ${
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