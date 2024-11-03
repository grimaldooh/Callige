// pages/teacher/groups.js
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ChangeImageModal from '../../../components/Modales/Groups/UpdateGroupImageModal';
import { useAuth } from '../../context/AuthContext';
import { PencilIcon, ClipboardListIcon } from '@heroicons/react/solid';

const Page = ({ groups, openModal }) => {
  const colors = ['bg-blue-800', 'bg-gray-400', 'bg-blue-400', 'bg-gray-700', 'bg-blue-400'];
    return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Grupos Vinculados</h1>

      {Array.isArray(groups) && groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {groups.map((group, index) => (
            <div key={group.id} className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
              {group.imageUrl ? (
                <img
                  src={group.imageUrl}
                  alt="Grupo"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className={`w-full h-48 ${colors[index % colors.length]}`}></div>
              )}
              <div className="p-6 flex flex-col items-start">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{group.name}</h2>
                <p className="text-sm text-gray-600">ID del Grupo: {group.id}</p>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => openModal(group)}
                    className="text-gray-800 hover:text-gray-600 transition-colors"
                    title="Editar Imagen"
                  >
                    <PencilIcon className="w-6 h-6" />
                  </button>
                  <Link href={`/teacher/group/${group.id}`}>
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Lista de Asistencia"
                    >
                      <ClipboardListIcon className="w-6 h-6" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No tienes grupos vinculados.</p>
      )}
    </div>
  );
};

export default function Groups() {
  const { userId } = useAuth();
  const teacherId = userId;
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    if (!teacherId) return;

    const fetchGroups = async () => {
      try {
        const response = await fetch(`/api/teacher/groups?teacherId=${teacherId}`);
        const data = await response.json();
        setGroups(data.groups || []);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [teacherId]);

  const handleImageUpdated = (groupId, newImageUrl) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId ? { ...group, imageUrl: newImageUrl } : group
      )
    );
  };

  const openModal = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  return (
    <div>
      <Page groups={groups} openModal={openModal} />
      {showModal && selectedGroup && (
        <ChangeImageModal
          groupId={selectedGroup.id}
          onClose={() => setShowModal(false)}
          onImageUpdated={(newImageUrl) => handleImageUpdated(selectedGroup.id, newImageUrl)}
        />
      )}
    </div>
  );
}