'use client';

import { useEffect, useState } from 'react';

const ListaAsistentes = ({ groupId, onClose }) => {
  const [professors, setProfessors] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await fetch(`/api/group/assistants?groupId=${groupId}`);
        const data = await response.json();

        if (response.ok) {
          setProfessors(data.teachers);
          setStudents(data.students);
        } else {
          console.error('Error fetching assistants:', data.message);
        }
      } catch (error) {
        console.error('Error fetching assistants:', error);
      }
    };

    if (groupId) {
      fetchAssistants();
    }
  }, [groupId]);

  // Función para desvincular a un profesor
  const handleUnlinkTeacher = async (teacherId) => {
    try {
      const response = await fetch('/api/group/unlinkTeacher', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, teacherId }),
      });

      if (response.ok) {
        setProfessors((prev) => prev.filter((teacher) => teacher.id !== teacherId));
        alert('Profesor desvinculado correctamente');
      } else {
        const data = await response.json();
        console.error('Error desvinculando profesor:', data.message);
      }
    } catch (error) {
      console.error('Error desvinculando profesor:', error);
    }
  };

  // Función para desvincular a un estudiante
  const handleUnlinkStudent = async (studentId) => {
    try {
      const response = await fetch('/api/group/unlinkStudent', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, studentId }),
      });

      if (response.ok) {
        setStudents((prev) => prev.filter((student) => student.id !== studentId));
        alert('Estudiante desvinculado correctamente');
      } else {
        const data = await response.json();
        console.error('Error desvinculando estudiante:', data.message);
      }
    } catch (error) {
      console.error('Error desvinculando estudiante:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Lista de Asistentes</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Cerrar
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Profesores</h3>
          {professors.length > 0 ? (
            <ul className="list-disc list-inside">
              {professors.map((professor) => (
                <li key={professor.id} className="mb-1 flex justify-between items-center">
                  <span>{professor.name} - {professor.email}</span>
                  <button
                    onClick={() => handleUnlinkTeacher(professor.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Desvincular
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No hay un profesor vinculado a este grupo.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Estudiantes</h3>
          {students.length > 0 ? (
            <ul className="list-disc list-inside">
              {students.map((student) => (
                <li key={student.id} className="mb-1 flex justify-between items-center">
                  <span>{student.name} - {student.email}</span>
                  <button
                    onClick={() => handleUnlinkStudent(student.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Desvincular
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No hay estudiantes vinculados a este grupo.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaAsistentes;