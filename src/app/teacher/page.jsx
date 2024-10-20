'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ListaAsistentes from '../../components/Modales/Events/ListaAsistentes';

const TeachersPage = () => {
  const { schoolId, userId } = useAuth();
  const globalSchoolId = schoolId;
  const teacherId = userId;

  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showListaAsistentesModal, setShowListaAsistentesModal] = useState(false);

  const openListaAsistentesModal = (eventId) => {
    setSelectedEvent(eventId);
    setShowListaAsistentesModal(true);
  };

  const closeListaAsistentesModal = () => {
    setShowListaAsistentesModal(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    if (!teacherId) return;

    const fetchGroups = async () => {
      try {
        const response = await fetch(`/api/teacher/groups?teacherId=${teacherId}`);
        const data = await response.json();
        setGroups(data.groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/teacher/events?teacherId=${teacherId}`);
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
    fetchGroups();
  }, [teacherId]);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-5xl font-extrabold text-center mt-10 mb-16">Panel del Docente</h1>

      {/* Sección de Eventos */}
      <div className="events-section mb-16">
        <h2 className="text-4xl font-bold mb-8 text-center">Eventos del Docente</h2>
        {Array.isArray(events) && events.length === 0 ? (
          <p className="text-center text-xl text-gray-600">No hay eventos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(events) &&
              events.map((event) => (
                <div
                  key={event.id}
                  className="event-card bg-white shadow-xl rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
                >
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">{event.name}</h3>
                    <p className="text-gray-600 mb-4">
                      {new Date(event.date).toLocaleDateString()} - {event.location}
                    </p>
                    <p className="text-gray-800 mb-6">{event.description}</p>
                    <button
                      onClick={() => openListaAsistentesModal(event.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                    >
                      Lista de asistencia
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Sección de Grupos */}
      <div className="groups-section">
        <h2 className="text-4xl font-bold mb-8 text-center">Grupos Vinculados</h2>
        {Array.isArray(groups) && groups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => (
              <div
                key={group.id}
                className="group-card bg-white shadow-xl p-6 rounded-xl text-center transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                <Link href={`/teacher/group/${group.id}`}>
                  <div className="relative">
                    <img
                      src="https://cdn.pixabay.com/photo/2016/06/06/03/01/green-1438671_640.jpg" // Reemplaza con la URL de la imagen del grupo
                      alt={`Imagen del grupo ${group.name}`}
                      className="w-full h-32 object-cover rounded-t-xl"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-xl">
                      <h3 className="text-2xl font-semibold text-white">{group.name}</h3>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-gray-600 mt-2">Grupo : {group.id}</p>
                  
                  <Link href={`/teacher/group/${group.id}`}>
                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                      Lista de Asistencia
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-600">No estás vinculado a ningún grupo.</p>
        )}
      </div>

      {showListaAsistentesModal && (
        <ListaAsistentes eventId={selectedEvent} onClose={closeListaAsistentesModal} />
      )}
    </div>
  );
};

export default TeachersPage;