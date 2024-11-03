// components/SchoolTeachers.jsx
import React, { useState } from 'react';
import TeacherEventsClassesModal from './Modales/Teachers/TeacherEventsClassesModal';
import { UserIcon } from '@heroicons/react/solid';

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
          filteredTeachers.slice(0, 3).map((teacher) => (
            <li
              key={teacher.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex items-center justify-between hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              <div className="flex flex-col">
                <span className="text-gray-800 font-medium">{teacher.name}</span>
              </div>
              <button
                onClick={() => handleOpenTeacherDetail(teacher.id)}
                className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out"
                title='Ver detalles'
                >
                  <UserIcon className="w-5 h-5 text-blue-500" />
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