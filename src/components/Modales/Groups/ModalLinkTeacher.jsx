import { useState, useEffect } from 'react';
import { useAuth } from '../../../app/context/AuthContext';


const LinkTeacherModal = ({ groupId, onClose }) => {
  const {schoolId} = useAuth();
  const globalSchoolId = schoolId;

  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Lógica para obtener la lista de todos los profesors
    const fetchTeachers = async () => {
      try {
        if (!globalSchoolId) {
          console.log('globalSchoolId is not defined');
          return;
        }

        const response = await fetch(`/api/admin/teachers?schoolId=${globalSchoolId}`);
        const data = await response.json();
        const filteredTeachers = data.teachers.filter(
          (teacher) => !teacher.groups.some((group) => group.id === groupId)
        );
        setTeachers(filteredTeachers);
        setFilteredTeachers(filteredTeachers); // Inicialmente mostrar todos
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, [globalSchoolId]);

  // Filtrar profesores por el término de búsqueda
  useEffect(() => {
    const filtered = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeachers(filtered);
  }, [searchTerm, teachers]);

  const handleLinkTeacher = async (teacherId) => {
    try {
      const response = await fetch('/api/group/linkTeacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId, groupId }),
      });

      if (response.ok) {
        alert('Profesor vinculado al grupo correctamente');
        onClose(); // Cerrar la modal después de vincular
      } else {
        alert('Error al vincular al profesor');
      }
    } catch (error) {
      console.error('Error linking teacher to group:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-semibold mb-4">Vincular profesor a un grupo</h2>
        <input
          type="text"
          placeholder="Buscar profesores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        <ul className="max-h-60 overflow-y-auto">
          {filteredTeachers.map(teacher => (
            <li key={teacher.id} className="flex justify-between items-center mb-2">
              <span>{teacher.name}</span>
              <button
                onClick={() => handleLinkTeacher(teacher.id)}
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

export default LinkTeacherModal;