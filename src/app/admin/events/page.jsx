'use client';
//src/app/admin/events/page.jsx
import { useEffect, useState } from 'react';
import LinkTeacherModal from '../../../components/Modales/Events/ModalLinkTeacher';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModalTeacher, setShowModalTeacher] = useState(false);

  const openModalTeacher = (eventId) => {
    setSelectedEvent(eventId);
    setShowModalTeacher(true);
  };

  const closeModal = () => {
    setShowModalTeacher(false); 
    setSelectedEvent(null);
  };

  useEffect(() => {
    // Lógica para obtener la lista de todos los eventos
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events?schoolId=1");
        const data = await response.json();
        setEvents(data);
        console.log('data:', data);
        setFilteredEvents(data); // Inicialmente mostrar todos
      } catch (error) {
        console.error('Error fetching Events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(term)
    );

    setFilteredEvents(filtered);
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
      {filteredEvents.length === 0 ? (
        <p>No hay grupos disponibles.</p>
      ) : (
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
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Borrar
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Editar
                </button>
                <button
                  onClick={() => openModalTeacher(event.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-900"
                >
                  Vincular profesor
                </button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                  Estadísticas
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModalTeacher && (
        <LinkTeacherModal eventId={selectedEvent} onClose={closeModal} />
      )}
    </div>
  );
};

export default EventsPage;
