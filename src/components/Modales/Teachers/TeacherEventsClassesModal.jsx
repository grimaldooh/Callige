'use client';

import { useState, useEffect } from 'react';
import { EyeIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/navigation';

const TeacherEventsClassesModal = ({ teacherId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!teacherId) return;

    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const [groupsRes, eventsRes] = await Promise.all([
          fetch(`/api/teacher/groups?teacherId=${teacherId}`),
          fetch(`/api/teacher/events?teacherId=${teacherId}`),
        ]);

        if (!groupsRes.ok || !eventsRes.ok) {
          throw new Error('Error fetching teacher data');
        }

        const groupsData = await groupsRes.json();
        const eventsData = await eventsRes.json();

        setGroups(groupsData.groups);
        setEvents(eventsData.events);
      } catch (error) {
        setError('Error loading teacher data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId]);

  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return adjustedDate.toLocaleDateString();
  };

  const handleViewGroup = (groupId) => {
    router.push(`/admin/group/${groupId}`);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Eventos y Clases Vinculadas</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            {/* Listado de Clases */}
            <h3 className="text-xl font-semibold mb-2">Clases:</h3>
            <ul className="mb-4">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <li
                    key={group.id}
                    className="border p-4 rounded mb-2 flex justify-between items-center"
                  >
                    <div>
                      ID : {group.id} - {group.name}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewGroup(group.id)}
                        className="text-white p-2 rounded hover:bg-blue-50 transition-colors"
                        title="Ver grupo"
                      >
                        <EyeIcon className="w-6 h-6 text-blue-400" />
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No hay clases vinculadas.</p>
              )}
            </ul>

            {/* Listado de Eventos */}
            <h3 className="text-xl font-semibold mb-2">Eventos:</h3>
            <ul>
              {events.length > 0 ? (
                events.map((event) => (
                  <li key={event.id} className="border p-2 rounded mb-2">
                    {event.name} - {formattedDate(event.date)}
                  </li>
                ))
              ) : (
                <p>No hay eventos vinculados.</p>
              )}
            </ul>
          </>
        )}

        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TeacherEventsClassesModal;