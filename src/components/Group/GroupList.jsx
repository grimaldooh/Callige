// components/GroupStudentsModal.jsx
import React from 'react';
import AttendanceList from './AttendanceList';

const GroupList = ({ isOpen, onClose, data, selectedGroup }) => {
  if (!isOpen) return null;

  console.log('students:', data);
  const students = data.students;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Estudiantes del Grupo {selectedGroup}
        </h2>
        <ul className="space-y-4">
          {students.length > 0 ? (
            students.map((student) => (
              <li key={student.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow">
                <div>
                  <p className="text-lg font-semibold text-gray-700">{student.name}</p>
                  <p className="text-gray-500">{student.email}</p>
                </div>
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