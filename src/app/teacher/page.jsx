'use client'

import { useEffect, useState } from 'react';

const TeachersPage = () => {
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Lógica para obtener los grupos vinculados al profesor
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/teacher/groups?teacherId=10');
        const data = await response.json();
        setGroups(data.groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    // Obtener los eventos vinculados al profesor
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/teacher/events?teacherId=10');
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
    fetchGroups();
  }, []);

  const handleOpenGroupModal = async (groupId) => {
    try {
      const response = await fetch(`/api/groups?groupId=${groupId}`);
      const data = await response.json();
      setStudents(data);
      console.log('studentes:', data);
      setSelectedGroup(groupId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  return (
    <div className="container mx-auto ">
      <h1 className="text-5xl font-extrabold text-center mt-32">Panel del Docente</h1>

      {/* Sección de Eventos */}
      <div className="events-section mt-16">
        <h2 className="text-4xl font-bold mb-8 text-center">Eventos del Docente</h2>
        {events.length === 0 ? (
          <p className="text-center text-xl text-gray-600">No hay eventos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {events.map((event) => (
              <div key={event.id} className="event-card bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Imagen del evento */}
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{event.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {new Date(event.date).toLocaleDateString()} - {event.location}
                  </p>
                  <p className="text-gray-800 mb-6">{event.description}</p>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Grupos */}
      <div className="groups-section mt-16 mb-24">
        <h2 className="text-4xl font-bold mb-8 text-center">Grupos Vinculados</h2>
        {groups.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => (
              <li key={group.id} className="group-card bg-white shadow-lg p-6 rounded-lg text-center">
                <h3 className="text-2xl font-semibold">{group.name}</h3>
                <p className="text-gray-600 mt-2">Grupo: {group.id}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-xl text-gray-600">No estás vinculado a ningún grupo.</p>
        )}
      </div>
    </div>

  );
};

export default TeachersPage;
