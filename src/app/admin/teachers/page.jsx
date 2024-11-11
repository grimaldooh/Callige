'use client';

import { useEffect, useState } from 'react';
import LinkTeacherModal from '../../../components/Teachers/LinkTeacherModal';
import LinkTeacherEventModal from '../../../components/Teachers/LinkTeacherEventModal';
import EditTeacherModal from '../../../components/Modales/Teachers/EditTeacherModal';
import TeacherEventsClassesModal from '../../../components/Modales/Teachers/TeacherEventsClassesModal'; // Nueva importación
import { useAuth } from '../../context/AuthContext';
import { TrashIcon, PencilIcon, UserAddIcon, CalendarIcon, ClipboardListIcon } from '@heroicons/react/solid';

const TeachersPage = () => {
  const { schoolId } = useAuth();
  const globalSchoolId = schoolId;

  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalEvento, setShowModalEvento] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEventsClassesModal, setShowEventsClassesModal] = useState(false); // Nuevo estado
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const handleOpenDeleteModal = (teacherId) => {
    setSelectedTeacher(teacherId);
    setIsModalDeleteOpen(true);
  };

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

  const openEditModal = (teacherId) => {
    setSelectedTeacher(teacherId);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedTeacher(null);
  };

  const openEventsClassesModal = (teacherId) => {
    setSelectedTeacher(teacherId);
    setShowEventsClassesModal(true); // Abrir la nueva modal
  };

  const closeEventsClassesModal = () => {
    setShowEventsClassesModal(false); // Cerrar la nueva modal
    setSelectedTeacher(null);
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        if (!globalSchoolId) {
          console.log('globalSchoolId is not defined');
          return;
        }

        const response = await fetch(`/api/admin/teachers?schoolId=${globalSchoolId}`);
        const data = await response.json();
        setTeachers(data.teachers);
        setFilteredTeachers(data.teachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, [globalSchoolId]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(term) || teacher.id.toString().includes(term)
    );

    setFilteredTeachers(filtered);
  };


  const handleDelete = async (teacherId) => {
    try {
      const response = await fetch('/api/admin/teachers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: teacherId }),
      });
      if (response.ok) {
        setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
        setFilteredTeachers(filteredTeachers.filter(teacher => teacher.id !== teacherId));
        alert('Profesor eliminado correctamente');
      }
    } catch (error) {
      console.error('Error eliminando profesor:', error);
      alert('Hubo un error al eliminar al profesor');
    }
  };

  return (
    <div className="container mx-auto mt-4 p-4">
      <h1 className="text-4xl font-bold mb-6">Listado de Profesores</h1>

      <input
        type="text"
        placeholder="Buscar por nombre o Id..."
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        value={searchTerm}
        onChange={handleSearch}
      />

      {Array.isArray(filteredTeachers) && filteredTeachers.length > 0 ? (
        <ul className="list-disc list-inside">
          {filteredTeachers.map((teacher) => (
            <li
              key={teacher.id}
              className="flex justify-between items-center p-4 bg-gray-100 mb-2 rounded shadow-md"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{teacher.name}</h3>
                <p className="text-gray-600 text-sm">ID: {teacher.id}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleOpenDeleteModal(teacher.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Borrar"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => openEditModal(teacher.id)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  title="Editar"
                >
                  <PencilIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => openModal(teacher.id)}
                  className="text-green-500 hover:text-green-700 transition-colors"
                  title="Vincular a grupo"
                >
                  <UserAddIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => openModalEvento(teacher.id)}
                  className="text-orange-500 hover:text-orange-700 transition-colors"
                  title="Vincular a evento"
                >
                  <CalendarIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => openEventsClassesModal(teacher.id)}
                  className="text-yellow-500 hover:text-yellow-700 transition-colors"
                  title="Eventos y clases"
                >
                  <ClipboardListIcon className="w-6 h-6" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron profesores.</p>
      )}

      {/* Modales */}
      {isModalDeleteOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">¿Estás seguro de que quieres eliminar al profesor?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalDeleteOpen(false)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedTeacher);
                  setIsModalDeleteOpen(false);
                }}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <LinkTeacherModal teacherId={selectedTeacher} onClose={closeModal} />
      )}

      {showModalEvento && (
        <LinkTeacherEventModal teacherId={selectedTeacher} onClose={closeModalEvento} />
      )}

      {showEditModal && (
        <EditTeacherModal teacherId={selectedTeacher} setTeachers={setFilteredTeachers} onClose={closeEditModal} />
      )}

      {showEventsClassesModal && (
        <TeacherEventsClassesModal teacherId={selectedTeacher}  onClose={closeEventsClassesModal} />
      )}
    </div>
  );
};

export default TeachersPage;