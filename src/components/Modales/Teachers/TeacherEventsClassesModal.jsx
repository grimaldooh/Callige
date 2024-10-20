'use client';

import { useEffect, useState } from 'react';

const TeacherEventsClassesModal = ({ teacherId, onClose}) => {
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamada a la API para obtener los grupos y eventos del profesor
    const fetchTeacherData = async () => {
      try {
        const [groupsResponse, eventsResponse] = await Promise.all([
          fetch(`/api/teacher/groups?teacherId=${teacherId}`),
          fetch(`/api/teacher/events?teacherId=${teacherId}`),
        ]);

        const groupsData = await groupsResponse.json();
        const eventsData = await eventsResponse.json();

        setGroups(groupsData.groups);
        setEvents(eventsData.events);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId]);

  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const formattedDate = adjustedDate.toLocaleDateString();
    return formattedDate;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-2/3">
        <h2 className="text-xl font-bold mb-4">Eventos y Clases Vinculadas</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div>
            {/* Listado de Grupos */}
            <h3 className="text-lg font-semibold">Clases Vinculadas</h3>
            {groups.length > 0 ? (
              <ul className="list-disc list-inside mb-4">
                {groups.map((group) => (
                  <li key={group.id}>
                    <span className="font-bold">Grupo:</span> {group.name} - <span className='font-semibold'>{group.id}</span> 
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay clases vinculadas.</p>
            )}

            {/* Listado de Eventos */}
            <h3 className="text-lg font-semibold">Eventos Vinculados</h3>
            {events.length > 0 ? (
              <ul className="list-disc list-inside">
                {events.map((event) => (
                  <li key={event.id}>
                    <span className="font-bold">Evento:</span> {event.name} ({formattedDate(event.date)})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay eventos vinculados.</p>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TeacherEventsClassesModal;