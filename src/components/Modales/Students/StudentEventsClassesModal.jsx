'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon } from '@heroicons/react/solid';


const StudentEventsClassesModal = ({ studentId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const [groupsRes, eventsRes] = await Promise.all([
          fetch(`/api/student/groups?studentId=${studentId}`),
          fetch(`/api/student/events?studentId=${studentId}`),
        ]);

        if (!groupsRes.ok || !eventsRes.ok) {
          throw new Error('Error fetching student data');
        }

        const groupsData = await groupsRes.json();
        const eventsData = await eventsRes.json();

        setGroups(groupsData.groups);
        setEvents(eventsData.events);
      } catch (error) {
        setError('Error loading student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const formattedDate = adjustedDate.toLocaleDateString();
    return formattedDate;
  };

  const handleViewGroup = (groupId) => {
    router.push(`/admin/group/${groupId}`);
  };

  const handleDeleteGroup = (groupId) => {
    // Implement delete group functionality here
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Clases y Eventos Vinculados</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
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
                        className=" text-white p-2 rounded hover:bg-blue-50 transition-colors"
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

export default StudentEventsClassesModal;