// src/components/Modales/Events/ListaAsistentes.jsx
'use client';

import { useEffect, useState } from 'react';

const ListaAsistentes = ({ eventId, onClose }) => {
  const [professors, setProfessors] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await fetch(`/api/event/assistants?eventId=${eventId}`);
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

    if (eventId) {
      fetchAssistants();
    }
  }, [eventId]);

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
                <li key={professor.id} className="mb-1">
                  {professor.name} - {professor.email}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No hay profesores vinculados a este evento.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Estudiantes</h3>
          {students.length > 0 ? (
            <ul className="list-disc list-inside">
              {students.map((student) => (
                <li key={student.id} className="mb-1">
                  {student.name} - {student.email}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No hay estudiantes vinculados a este evento.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaAsistentes;