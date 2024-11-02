'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AttendanceList from '../../../components/Modales/Events/AttendanceList';
import ListaAsistentes from '../../../components/Modales/Events/ListaAsistentes';

import React from 'react';

export default function events() {
  const { schoolId, userId } = useAuth();
  const teacherId = userId;
  const [events, setEvents] = useState([]);
  const today = new Date();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showListaAsistentesModal, setShowListaAsistentesModal] = useState(false);
  const [showAsistentesModal, setShowAsistentesModal] = useState(false);
  const upcomingEvents = events.filter((event) => new Date(event.date) > today);
  const pastEvents = events.filter((event) => new Date(event.date) <= today);

  useEffect(() => {
    if (!teacherId) return;

    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `/api/teacher/events?teacherId=${teacherId}`
        );
        const data = await response.json();
        console.log("eventos", data);
        setEvents(data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [teacherId]);

  const handleShowListaAsistentesModal = (eventId) => {
    setSelectedEvent(eventId);
    setShowListaAsistentesModal(true);
  };

  const handleShowAsistentes = (eventId) => {
    setSelectedEvent(eventId);
    setShowAsistentesModal(true);
  };

  const closeListaAsistentesModal = () => {
    setShowListaAsistentesModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="events-section mb-16 mt-8 ml-4">
      <h2 className="text-4xl font-bold mb-8 text-center">
        Eventos del Docente
      </h2>

      <h3 className="text-3xl font-semibold mb-4">Próximos Eventos</h3>
      {upcomingEvents.length === 0 ? (
        <p className="text-center text-xl text-gray-600">
          No hay eventos disponibles.
        </p>
      ) : (
        <div className="space-y-8">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="event-card bg-gray-100 shadow-xl rounded-xl overflow-hidden transition-transform transform hover:shadow-2xl flex items-center"
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-24 h-24 object-cover rounded-lg m-4"
                />
              )}
              <div className="p-6 flex-1">
                <h3 className="text-2xl font-semibold mb-2">{event.name}</h3>
                <p className="text-gray-600 mb-2">
                  {new Date(event.date).toLocaleDateString()} - {event.location}
                </p>
                <p className="text-gray-500 mb-2">ID del Evento: {event.id}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleShowListaAsistentesModal(event.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Lista de asistencia
                  </button>
                  {new Date(event.date) <= today && (
                    <button
                      onClick={() => handleShowAsistentes(event.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Ver Asistentes
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-3xl font-semibold mb-4 mt-12">Eventos Pasados</h3>
      {pastEvents.length === 0 ? (
        <p className="text-center text-xl text-gray-600">
          No hay eventos disponibles.
        </p>
      ) : (
        <div className="space-y-8">
          {pastEvents.map((event) => (
            <div
              key={event.id}
              className="event-card bg-gray-100 shadow-xl rounded-xl overflow-hidden transition-transform transform hover:shadow-2xl flex items-center"
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-24 h-24 object-cover rounded-lg m-4"
                />
              )}
              <div className="p-6 flex-1">
                <h3 className="text-2xl font-semibold mb-2">{event.name}</h3>
                <p className="text-gray-600 mb-2">
                  {new Date(event.date).toLocaleDateString()} - {event.location}
                </p>
                <p className="text-gray-500 mb-2">ID del Evento: {event.id}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleShowListaAsistentesModal(event.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Lista de asistencia
                  </button>
                  {new Date(event.date) <= today && (
                    <button
                      onClick={() => handleShowAsistentes(event.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Ver Asistentes
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista de Asistentes Modal */}
      {showAsistentesModal && (
        <AttendanceList
          eventId={selectedEvent}
          showModal={setShowAsistentesModal}
        />
      )}

      {/* Lista de Asistentes Modal */}
      {showListaAsistentesModal && (
        <ListaAsistentes
          eventId={selectedEvent}
          onClose={closeListaAsistentesModal}
        />
      )}
    </div>
  );
};
