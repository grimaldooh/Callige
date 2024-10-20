'use client';
//src/app/admin/events/page.jsx
import { useEffect, useState } from 'react';
import LinkTeacherModal from '../../../components/Modales/Events/ModalLinkTeacher';
import ListaAsistentes from '../../../components/Modales/Events/ListaAsistentes';

import EditEventModal from '../../../components/Modales/Events/EditEventModal';
import { useAuth } from '../../context/AuthContext';
import { gl } from 'date-fns/locale';

const EventsPage = () => {
  const {schoolId} = useAuth();
  const globalSchoolId = schoolId;
  
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModalTeacher, setShowModalTeacher] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showListaAsistentesModal, setShowListaAsistentesModal] = useState(false);


  const openModalTeacher = (eventId) => {
    setSelectedEvent(eventId);
    setShowModalTeacher(true);
  };

  const closeModal = () => {
    setShowModalTeacher(false); 
    setSelectedEvent(null);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedEvent(null);
  };

  const openListaAsistentesModal = (eventId) => {
    setSelectedEvent(eventId);
    setShowListaAsistentesModal(true);
  };

  const closeListaAsistentesModal = () => {
    setShowListaAsistentesModal(false);
    setSelectedEvent(null);
  };


  useEffect(() => {
    if (!globalSchoolId) return; // No hacer nada si no hay schoolId

    // Lógica para obtener la lista de todos los eventos
    const fetchEvents = async () => {
      try {
        if (!globalSchoolId) {
          console.log('globalSchoolId is not defined');
          return;
        }
        const response = await fetch(`/api/admin/events?schoolId=${globalSchoolId}`);
        const data = await response.json();
        setEvents(data.events);
        console.log('data:', data);
        setFilteredEvents(data.events); // Inicialmente mostrar todos
      } catch (error) {
        console.error('Error fetching Events:', error);
      }
    };

    fetchEvents();
  }, [globalSchoolId]);

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(term)
    );

    setFilteredEvents(filtered);
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: eventId }),
      });
      if (response.ok) {
        setEvents(events.filter(event => event.id !== eventId)); // Eliminar evento del estado
        setFilteredEvents(filteredEvents.filter(event => event.id !== eventId)); // Eliminar evento del
        alert('Evento eliminado correctamente');
      }
    } catch (error) {
      console.error('Error eliminando evento:', error);
      alert('Hubo un error al eliminar al evento');
    }
  };

  return (
    <div className="container mx-auto mt-28 ">
      <h1 className="text-4xl font-bold ">Listado de eventos</h1>

      {/* Barra de búsqueda */}
      <div className="mt-14 mb-8">
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Lista de eventos */}
      {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
        <ul className="list-disc list-inside">
          {filteredEvents.map((event) => (
            <li
              key={event.id}
              className="flex justify-between items-center p-4 bg-gray-100 mb-2 rounded shadow-md"
            >
              <div>
                <span className="font-bold">ID:</span> {event.id} - {event.name}
              </div>
              <div className="flex space-x-4">
                <button onClick={() => handleDelete(event.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Borrar
                </button>
                <button onClick={() => openEditModal(event.id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Editar
                </button>
                <button
                  onClick={() => openModalTeacher(event.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-900"
                >
                  Vincular profesor
                </button>
                <button
                  onClick={() => openListaAsistentesModal(event.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Ver lista de alumnos y profesores
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay eventos disponibles.</p>
      )}

      {showModalTeacher && (
        <LinkTeacherModal eventId={selectedEvent} onClose={closeModal} />
      )}

      {showEditModal && (
        <EditEventModal eventId={selectedEvent} setEvents={setFilteredEvents} onClose={closeEditModal} />
      )}
      {showListaAsistentesModal && (
        <ListaAsistentes eventId={selectedEvent} setEvents={setFilteredEvents} onClose={closeListaAsistentesModal} />
      )}
    </div>
  );
};

export default EventsPage;
