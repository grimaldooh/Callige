'use client';

//src/app/admin/students/page.jsx
import { useEffect, useState } from 'react';
import LinkStudentModal from '../../../components/Students/LinkStudentModal';
import EditStudentModal from '../../../components/Modales/Students/EditStudentModal';
import StudentEventsClassesModal from '../../../components/Modales/Students/StudentEventsClassesModal';
import { useAuth } from '../../context/AuthContext';
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
      student.name.toLowerCase().includes(term)
    );

    setFilteredStudents(filtered);
  };

  return (
    <div className="container mx-auto mt-24">
      <h1 className="text-4xl font-bold mb-6">Listado de Alumnos</h1>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Lista de estudiantes */}
      {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
        <ul className="list-disc list-inside">
          {filteredStudents.map((student) => (
            <li key={student.id} className="flex justify-between items-center p-4 bg-gray-100 mb-2 rounded shadow-md">
              <div>
                <span className="font-bold">ID:</span> {student.id} - {student.name}
              </div>
              <div className="flex space-x-4">
                <button onClick={() => handleDelete(student.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Borrar</button>
                <button onClick={() => openEditModal(student.id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Editar</button>
                <button onClick={() => openModal(student.id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Vincular</button>
                <button onClick={() => openEventsClassesModal(student.id)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Grupos y Eventos</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay estudiantes disponibles.</p>
      )}
      
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
