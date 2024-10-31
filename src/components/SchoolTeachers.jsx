// components/SchoolTeachers.jsx
import React, { useState } from 'react';
import TeacherEventsClassesModal from './Modales/Teachers/TeacherEventsClassesModal';

const SchoolTeachers = ({ teachers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isModalEventClassesTeacherOpen, setIsModalEventClassesTeacherOpen] = useState(false);

  const handleOpenTeacherDetail = (teacherId) => {
    setSelectedTeacher(teacherId);
    setIsModalEventClassesTeacherOpen(true);
  }

  const closeEventsClassesModal = () => {
    setIsModalEventClassesTeacherOpen(false);
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Profesores</h2>
      <input
        type="text"
        placeholder="Buscar profesores..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
      />
      <ul className="space-y-2">
        {Array.isArray(filteredTeachers) && filteredTeachers.length > 0 ? (
          filteredTeachers.slice(0,6).map((teacher) => (
            <li key={teacher.id}>
              <button
                onClick={() => handleOpenTeacherDetail(teacher.id)}
                className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out"
              >
                {teacher.name}
              </button>
            </li>
          ))
        ) : (
          <p>No hay profesores disponibles.</p>
        )}
      </ul>
      {isModalEventClassesTeacherOpen && (
        <TeacherEventsClassesModal teacherId={selectedTeacher} onClose={closeEventsClassesModal} />
      )}
    </div>
  );
};

export default SchoolTeachers;