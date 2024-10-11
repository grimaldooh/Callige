import { useState, useEffect } from 'react';

const LinkStudentModal = ({ studentId, onClose }) => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all groups for the school with ID 1
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups?schoolId=1');
        const data = await response.json();
        setGroups(data);
        setFilteredGroups(data); // Inicialmente muestra todos
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  // Filtrar grupos por el término de búsqueda
  useEffect(() => {
    const filtered = groups.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchTerm, groups]);

  const handleLinkGroup = async (groupId) => {
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
        onClose(); // Cerrar la modal tras vincular
      } else {
        alert('Error al vincular al estudiante');
      }
    } catch (error) {
      console.error('Error linking student to group:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-semibold mb-4">Vincular estudiante a un grupo</h2>
        <input
          type="text"
          placeholder="Buscar grupos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        <ul className="max-h-60 overflow-y-auto">
          {filteredGroups.map(group => (
            <li key={group.id} className="flex justify-between items-center mb-2">
              <span>{group.name}</span>
              <button 
                onClick={() => handleLinkGroup(group.id)} 
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
