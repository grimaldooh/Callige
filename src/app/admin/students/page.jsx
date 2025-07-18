'use client';

//src/app/admin/students/page.jsx
import { useEffect, useState } from 'react';
import LinkStudentModal from '../../../components/Students/LinkStudentModal';
import EditStudentModal from '../../../components/Modales/Students/EditStudentModal';
import StudentEventsClassesModal from '../../../components/Modales/Students/StudentEventsClassesModal';
import { useAuth } from '../../context/AuthContext';
import { TrashIcon, PencilIcon, UserAddIcon, ClipboardListIcon } from '@heroicons/react/solid';
import { set } from 'date-fns';


const StudentsPage = () => {

  const {schoolId} = useAuth();
  const globalSchoolId = schoolId;
  console.log('globalSchoolId:', globalSchoolId);
  console.log('schoolId:', schoolId);

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEventsClassesModal, setShowEventsClassesModal] = useState(false); // Estado para controlar la nueva modal
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const handleOpenDeleteModal = (studentId) => {
    setSelectedStudent(studentId);
    setIsModalDeleteOpen(true);
  };

  const openModal = (studentId) => {
    setSelectedStudent(studentId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedStudent(null);
  };

  const openEventsClassesModal = (studentId) => {
    setSelectedStudent(studentId);
    setShowEventsClassesModal(true);
  };

  const closeEventsClassesModal = () => {
    setShowEventsClassesModal(false);
    setSelectedStudent(null);
  };

  const handleDelete = async (studentId) => {
    try {
      const response = await fetch('/api/admin/students', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: studentId }),
      });
      if (response.ok) {
        setStudents(students.filter(student => student.id !== studentId)); // Eliminar el estudiante del estado
        setFilteredStudents(filteredStudents.filter(student => student.id !== studentId)); // Eliminar el estudiante del estado
        alert('Estudiante eliminado correctamente');
      }
    } catch (error) {
      console.error('Error eliminando estudiante:', error);
      alert('Hubo un error al eliminar al estudiante');
    }
  };



  useEffect(() => {
    if (!globalSchoolId) return; // No hacer nada si no hay schoolId

    // Lógica para obtener la lista de todos los estudiantes
    const fetchStudents = async () => {
      try {
        if (!globalSchoolId) {
          console.log('globalSchoolId is not defined');
          return;
        }

        console.log('globalSchoolId:', globalSchoolId);
        const response = await fetch(`/api/admin/students?schoolId=${globalSchoolId}`);
        const data = await response.json();
        console.log('Fetched students:', data.students);
        setStudents(data.students);
        setFilteredStudents(data.students); // Inicialmente mostrar todos
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [globalSchoolId]);

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(term) || student.id.toString().includes(term)
    );

    setFilteredStudents(filtered);
  };

  return (
    <div className="container mx-auto mt-4 p-4">
      <h1 className="text-4xl font-bold mb-6">Listado de Alumnos</h1>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre o Id..."
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Lista de estudiantes */}
      {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
        <ul className="list-disc list-inside">
          {filteredStudents.map((student) => (
            <li key={student.id} className="flex justify-between items-center p-4 bg-gray-100 mb-4 rounded shadow-md">
              <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{student.name}</h3>
              <p className="text-gray-600 text-sm ">ID: {student.id}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleOpenDeleteModal(student.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Borrar"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => openEditModal(student.id)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  title="Editar"
                >
                  <PencilIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => openModal(student.id)}
                  className="text-green-500 hover:text-green-700 transition-colors"
                  title="Vincular"
                >
                  <UserAddIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => openEventsClassesModal(student.id)}
                  className="text-yellow-500 hover:text-yellow-700 transition-colors"
                  title="Grupos y Eventos"
                >
                  <ClipboardListIcon className="w-6 h-6" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay estudiantes disponibles.</p>
      )}

      {isModalDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¿Estás seguro de eliminar al estudiante?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsModalDeleteOpen(false)}
                className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { handleDelete(selectedStudent); setIsModalDeleteOpen(false); }}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )  
      }
      
      {showModal && (
        <LinkStudentModal
          studentId={selectedStudent}
          onClose={closeModal}
        />
      )}
      {showEditModal && (
        <EditStudentModal studentId={selectedStudent} setStudents={setFilteredStudents} onClose={closeEditModal}  />
      )}
      {showEventsClassesModal && (
        <StudentEventsClassesModal studentId={selectedStudent} onClose={closeEventsClassesModal} />
      )}
    </div>
  );
};

export default StudentsPage;
