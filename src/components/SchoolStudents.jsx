// components/SchoolStudents.jsx
import React, { useState } from 'react';
import StudentEventsClassesModal from './Modales/Students/StudentEventsClassesModal';
import { EyeIcon } from '@heroicons/react/solid';

const SchoolStudents = ({ students}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const [isModalEventClassesStudentOpen, setIsModalEventClassesStudentOpen] = useState(false);

    const handleOpenStudentDetail = (studentId) => {
      setSelectedStudent(studentId);
      setIsModalEventClassesStudentOpen(true);
    };

    const closeEventsClassesModal = () => {
      setIsModalEventClassesStudentOpen(false);
    };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md z-50">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Estudiantes</h2>
      <input
        type="text"
        placeholder="Buscar alumnos..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
      />
      <ul className="space-y-2 z-50">
        {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
          filteredStudents.slice(0, 3).map((student) => (
            <li
              key={student.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex items-center justify-between hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={student.imageUrl || "https://via.placeholder.com/50"}
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-800 font-medium">
                  {student.name}
                </span>
              </div>
              <button
                onClick={() => handleOpenStudentDetail(student.id)}
                className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out"
                title='Ver detalles'
                >
                  <EyeIcon className="w-5 h-5 text-blue-500" />
                </button>
            </li>
          ))
        ) : (
          <p>No hay estudiantes disponibles.</p>
        )}
      </ul>
      {isModalEventClassesStudentOpen && (
        <StudentEventsClassesModal
          studentId={selectedStudent}
          onClose={closeEventsClassesModal}
        />
      )}
    </div>
  );
};

export default SchoolStudents;