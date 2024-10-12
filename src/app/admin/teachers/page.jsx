'use client';

import { useEffect, useState } from 'react';
import LinkTeacherModal from '../../../components/Teachers/LinkTeacherModal';
import LinkTeacherEventModal from '../../../components/Teachers/LinkTeacherEventModal';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalEvento, setShowModalEvento] = useState(false);

  const openModal = (teacherId) => {
    setSelectedTeacher(teacherId);
    setShowModal(true);
  };

  const openModalEvento = (teacherId) => {
    setSelectedTeacher(teacherId);
    setShowModalEvento(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeacher(null);
  };

  const closeModalEvento = () => {
    setShowModalEvento(false);
    setSelectedTeacher(null);
    };

  useEffect(() => {
    // Lógica para obtener la lista de todos los profesors
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/admin/teachers');
        const data = await response.json();
        setTeachers(data.teachers);
        setFilteredTeachers(data.teachers); // Inicialmente mostrar todos
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(term)
    );

    setFilteredTeachers(filtered);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-4xl font-bold mb-6">Listado de Profesores</h1>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Lista de profesores */}
      {filteredTeachers.length === 0 ? (
        <p>No hay profesores disponibles.</p>
      ) : (
        <ul className="list-disc list-inside">
          {filteredTeachers.map((teacher) => (
            <li
              key={teacher.id}
              className="flex justify-between items-center p-4 bg-gray-100 mb-2 rounded shadow-md"
            >
              <div>
                <span className="font-bold">ID:</span> {teacher.id} -{" "}
                {teacher.name}
              </div>
              <div className="flex space-x-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Borrar
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Editar
                </button>
                <button
                  onClick={() => openModal(teacher.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Vincular a grupo
                </button>
                <button
                  onClick={() => openModalEvento(teacher.id)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Vincular a evento
                </button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                  Estadísticas
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showModal && (
        <LinkTeacherModal teacherId={selectedTeacher} onClose={closeModal} />
      )}
      {showModalEvento && (
        <LinkTeacherEventModal
          teacherId={selectedTeacher}
          onClose={closeModalEvento}
        />
      )}
    </div>
  );
};

export default TeachersPage;
