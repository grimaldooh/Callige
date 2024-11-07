// components/Modales/Groups/ModalLinkStudent.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../../app/context/AuthContext';


const LinkStudentModal = ({ groupId, onClose }) => {
  const {schoolId} = useAuth();
  const globalSchoolId = schoolId;

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  

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
        console.log("Fetched students:", data.students);
        const filteredStudents = data.students.filter(
          (student) => !student.groups.some((group) => group.id === groupId)
        );
        setStudents(filteredStudents);
        setFilteredStudents(filteredStudents); // Inicialmente mostrar todos
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [globalSchoolId]);

  // Filtrar estudiantes por el término de búsqueda
  useEffect(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.id.toString().includes(searchTerm)
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleLinkStudent = async (studentId) => {
    try {
      const response = await fetch('/api/group/linkStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, groupId }),
      });

      if (response.ok) {
        alert('Estudiante vinculado al grupo correctamente');
        //onClose(); // Cerrar la modal tras vincular
      } else {
        alert('Error al vincular al estudiante');
      }
    } catch (error) {
      console.error('Error linking student to group:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Vincular estudiante al grupo
        </h2>
        <input
          type="text"
          placeholder="Buscar estudiantes por nombre o ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        <ul className="max-h-60 overflow-y-auto">
          {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <li
                key={student.id}
                className="flex justify-between items-center mb-2"
              >
                <div>
                  <span className='font-bold'>ID: {student.id} - </span>
                  <span>{student.name}</span>
                </div>
                <button
                  onClick={() => handleLinkStudent(student.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Vincular
                </button>
              </li>
            ))
          ) : (
            <p>No hay estudiantes disponibles.</p>
          )}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default LinkStudentModal;