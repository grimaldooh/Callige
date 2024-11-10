import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';

const LinkTeacherModal = ({ teacherId, onClose }) => {
  const { schoolId } = useAuth();
  const globalSchoolId = schoolId;

  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all groups for the school with ID 1
    if (!globalSchoolId) return;
    const fetchGroups = async () => {
      try {
        const response = await fetch(`/api/groups?schoolId=${globalSchoolId}`);
        const data = await response.json();
        setGroups(data);
        setFilteredGroups(data); // Inicialmente muestra todos
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, [globalSchoolId]);

  // Filtrar grupos por el término de búsqueda
  useEffect(() => {
    const filtered = groups.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchTerm, groups]);

  const handleLinkGroup = async (groupId) => {
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
        onClose(); // Cerrar la modal tras vincular
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
          placeholder="Buscar grupos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        <ul className="max-h-60 overflow-y-auto">
          {Array.isArray(filteredGroups) && filteredGroups.length > 0 ? (
            filteredGroups.map(group => (
              <li key={group.id} className="flex justify-between items-center mb-2">
                <span>{group.name}</span>
                <button 
                  onClick={() => handleLinkGroup(group.id)} 
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Vincular
                </button>
              </li>
            ))
          ) : (
            <p>No hay grupos disponibles.</p>
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

export default LinkTeacherModal;
