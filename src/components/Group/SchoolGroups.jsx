// components/SchoolGroups.jsx
import React, { useState } from 'react';
import { ClipboardListIcon } from '@heroicons/react/solid';

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
      <ul className="space-y-4">
        {Array.isArray(filteredGroups) && filteredGroups.length > 0 ? (
          filteredGroups.slice(0, 3).map((group) => (
            <li
              key={group.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex items-center justify-between hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              <div className="flex flex-col">
                <span className="text-gray-800 font-semibold text-lg">{group.name}</span>
              </div>
              <button
                onClick={() => handleOpenGroupModal(group.id)}
                className=" text-white px-4 py-1 rounded hover:bg-blue-50 transition duration-300 ease-in-out"
                title='Ver detalles'
              >
                <ClipboardListIcon className="w-5 h-5 text-blue-500" />
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