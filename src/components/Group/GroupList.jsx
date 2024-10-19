import React, { useEffect, useState } from 'react';
import AttendanceList from './AttendanceList';

const GroupList = ({ isOpen, onClose, data, selectedGroup }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (data && data.students) {
      // Carga los estudiantes al abrir el modal
      setStudents(data.students);
    }
  }, [data]);

  const handleRemoveStudent = async (studentId) => {
    const response = await fetch('/api/group/removeAssistant', {
      method: 'POST',
      body: JSON.stringify({ groupId: selectedGroup, studentId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Filtra el estudiante eliminado de la lista
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== studentId));
    } else {
      console.error('Error al desvincular el estudiante');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Estudiantes del Grupo {selectedGroup}
        </h2>
        <ul className="space-y-4">
          {Array.isArray(students) && students.length > 0 ? (
            students.map((student) => (
              <li key={student.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow">
                <div>
                  <p className="text-lg font-semibold text-gray-700">{student.name}</p>
                  <p className="text-gray-500">{student.email}</p>
                </div>
                <button
                  onClick={() => handleRemoveStudent(student.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Desvincular
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No hay estudiantes en este grupo.</p>
          )}
        </ul>
        <AttendanceList groupId={selectedGroup} />

        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 ease-in-out"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default GroupList;