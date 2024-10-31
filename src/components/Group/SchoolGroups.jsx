// components/SchoolGroups.jsx
import React, { useState } from 'react';

const SchoolGroups = ({ groups, handleOpenGroupModal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Grupos</h2>
      <input
        type="text"
        placeholder="Buscar grupos..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
      />
      <ul className="space-y-2">
        {Array.isArray(filteredGroups) && filteredGroups.length > 0 ? (
          filteredGroups.slice(0,6).map((group) => (
            <li key={group.id}>
              <button
                onClick={() => handleOpenGroupModal(group.id)}
                className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out"
              >
                {group.name}
              </button>
            </li>
          ))
        ) : (
          <p>No hay grupos disponibles.</p>
        )}
      </ul>
    </div>
  );
};

export default SchoolGroups;