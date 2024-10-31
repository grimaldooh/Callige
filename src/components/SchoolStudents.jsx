// components/SchoolStudents.jsx
import React, { useState } from 'react';
import StudentEventsClassesModal from './Modales/Students/StudentEventsClassesModal';

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
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Estudiantes</h2>
      <input
        type="text"
        placeholder="Buscar alumnos..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
      />
      <ul className="space-y-2">
        {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
          filteredStudents.slice(0,6).map((student) => (
            <li key={student.id}>
              <button
                onClick={() => handleOpenStudentDetail(student.id)}
                className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out"
              >
                {student.name}
              </button>
            </li>
          ))
        ) : (
          <p>No hay grupos disponibles.</p>
        )}
      </ul>
      {isModalEventClassesStudentOpen && (
        <StudentEventsClassesModal studentId={selectedStudent} onClose={closeEventsClassesModal} />
      )}
    </div>
  );
};

export default SchoolStudents;