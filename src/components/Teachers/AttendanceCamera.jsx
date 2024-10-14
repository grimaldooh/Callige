import React, { useState } from 'react';

const AttendanceCamera = () => {
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [attendanceList, setAttendanceList] = useState(null);

  const handleSaveAttendance = async () => {
    try {
      // Llamada al endpoint en Python para guardar la asistencia
      const response = await fetch('http://localhost:8080/save_attendance', {
        method: 'GET',  // Aquí usas el método GET, según tu código en Flask
      });

      if (response.ok) {
        setAttendanceSaved(true); // Marcar que la asistencia ha sido guardada
        alert('Asistencia guardada con éxito');
      } else {
        throw new Error('Error al guardar la asistencia');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const handleFetchAttendance = async () => {
    try {
      const response = await fetch('/api/teacher/attendance');
      const data = await response.json();
      setAttendanceList(data.attendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Attendance Camera</h1>

      {/* Video feed */}
      <div className="w-full max-w-3xl rounded-lg overflow-hidden shadow-lg mb-6">
        <img
          src="http://localhost:8080/video_feed"
          alt="Video Feed"
          className="w-full h-auto"
        />
      </div>

      {/* Botón para guardar asistencia */}
      <button 
        onClick={handleSaveAttendance}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md"
        disabled={attendanceSaved}
      >
        {attendanceSaved ? 'Asistencia Guardada' : 'Finalizar y Guardar Asistencia'}
      </button>

      {/* Mostrar botón de lista de asistencia solo si la asistencia ha sido guardada */}
      {attendanceSaved && (
        <button 
          onClick={handleFetchAttendance}
          className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-md"
        >
          Mostrar Lista de Asistencia
        </button>
      )}

      {/* Mostrar la lista de asistencia si está disponible */}
      {attendanceList ? (
        <div className="mt-6 w-full">
          <h2 className="text-2xl font-semibold mb-4">Lista de Asistencia</h2>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">Alumno</th>
                <th className="border border-gray-200 p-2">Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map(student => (
                <tr key={student.id}>
                  <td className="border border-gray-200 p-2">{student.name}</td>
                  <td className="border border-gray-200 p-2">{student.present ? '✔️' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        attendanceSaved && <p className="mt-4">No hay asistencia registrada aún.</p>
      )}
    </div>
  );
};

export default AttendanceCamera;