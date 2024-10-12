// components/Modales/Groups/ModalLinkStudent.jsx
import { useState, useEffect } from 'react';

const LinkStudentModal = ({ groupId, onClose }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all students
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students'); // Cambia esta ruta según tu API de estudiantes
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data); // Inicialmente muestra todos los estudiantes
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Filtrar estudiantes por el término de búsqueda
  useEffect(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h2 className="text-xl font-semibold mb-4">Vincular estudiante al grupo</h2>
        <input
          type="text"
          placeholder="Buscar estudiantes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        <ul className="max-h-60 overflow-y-auto">
          {filteredStudents.map(student => (
            <li key={student.id} className="flex justify-between items-center mb-2">
              <span>{student.name}</span>
              <button 
                onClick={() => handleLinkStudent(student.id)} 
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Vincular
              </button>
            </li>
          ))}
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