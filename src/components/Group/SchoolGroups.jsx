// components/SchoolGroups.jsx
import React from 'react';

const SchoolGroups = ({ groups, handleOpenGroupModal }) => {
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Grupos de la Escuela</h2>
      <ul className="space-y-2">
        {groups.map((group) => (
          <li key={group.id}>
            <button
              onClick={() => handleOpenGroupModal(group.id)}
              className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out"
            >
              {group.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchoolGroups;