'use client';
import { useEffect, useState } from 'react';
import LinkTeacherModal from '../../../components/Modales/Events/ModalLinkTeacher';
import ListaAsistentes from '../../../components/Modales/Events/ListaAsistentes';
import AttendanceList from '../../../components/Modales/Events/AttendanceList';
import EditEventModal from '../../../components/Modales/Events/EditEventModal';
import { useAuth } from '../../context/AuthContext';
import { TrashIcon, PencilIcon, UserAddIcon, ClipboardListIcon,UsersIcon } from '@heroicons/react/solid';

const EventsPage = () => {
  const { schoolId } = useAuth();
  const globalSchoolId = schoolId;

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModalTeacher, setShowModalTeacher] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showListaAsistentesModal, setShowListaAsistentesModal] = useState(false);
  const [showAsistentesModal, setShowAsistentesModal] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false); // Estado del switch

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Resetear la hora para comparar solo la fecha

  const toggleEventFilter = () => setShowPastEvents(!showPastEvents);

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

  const openListaAsistencia = (eventId) => {
    setSelectedEvent(eventId);
    setShowAsistentesModal(true);
  };

  const closeListaAsistentesModal = () => {
    setShowListaAsistentesModal(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    if (!globalSchoolId) return;

    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/admin/events?schoolId=${globalSchoolId}`);
        const data = await response.json();
        setEvents(data.events);
        setFilteredEvents(data.events);
      } catch (error) {
        console.error('Error fetching Events:', error);
      }
    };

    fetchEvents();
  }, [globalSchoolId]);

  // Actualizar eventos según el filtro seleccionado (pasados o próximos)
  useEffect(() => {
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.date);
      return showPastEvents ? eventDate < today : eventDate >= today;
    });
    setFilteredEvents(filtered);
  }, [events, showPastEvents]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(term) || event.id.toString().includes(term)
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
        setEvents(events.filter(event => event.id !== eventId));
        setFilteredEvents(filteredEvents.filter(event => event.id !== eventId));
        alert('Evento eliminado correctamente');
      }
    } catch (error) {
      console.error('Error eliminando evento:', error);
      alert('Hubo un error al eliminar al evento');
    }
  };

  return (
    <div className="container mx-auto mt-4 p-4">
      <h1 className="text-4xl font-bold">Listado de eventos</h1>

      {/* Toggle para eventos pasados y próximos */}
      <div className="flex items-center mt-8 mb-6">
        <span className="mr-2 text-gray-600">Eventos próximos</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showPastEvents}
            onChange={toggleEventFilter}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <span className="ml-2 text-gray-600">Eventos pasados</span>
      </div>

      {/* Barra de búsqueda */}
      <div className="mt-8 mb-8">
        <input
          type="text"
          placeholder="Buscar por nombre o Id..."
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Lista de eventos */}
      {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-50 border border-gray-200 rounded-lg shadow-lg overflow-hidden flex items-center"
            >
              <img
                src={event.imageUrl || "https://via.placeholder.com/300"}
                alt={event.name}
                className="w-32 h-32 object-cover p-2 rounded-full"
              />

              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {event.name}{" "}
                  <span className="text-sm text-gray-500">ID: {event.id}</span>
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Fecha:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()} <br />
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {event.description ||
                    "No hay descripción disponible para este evento."}
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Borrar"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => openEditModal(event.id)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="Editar"
                  >
                    <PencilIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => openModalTeacher(event.id)}
                    className="text-green-500 hover:text-green-700 transition-colors"
                    title="Vincular profesor"
                  >
                    <UserAddIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => openListaAsistentesModal(event.id)}
                    className="text-yellow-500 hover:text-yellow-700 transition-colors"
                    title="Ver lista de alumnos y profesores"
                  >
                    <ClipboardListIcon className="w-6 h-6" />
                  </button>
                  {showPastEvents && (
                    <button
                      onClick={() => openListaAsistencia(event.id)}
                      className="text-black-500 hover:text-yellow-700 transition-colors"
                      title="Ver lista de asistencia"
                    >
                      <UsersIcon className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No hay eventos disponibles.</p>
      )}

      {showModalTeacher && (
        <LinkTeacherModal eventId={selectedEvent} onClose={closeModal} />
      )}
      {showEditModal && (
        <EditEventModal
          eventId={selectedEvent}
          setEvents={setFilteredEvents}
          onClose={closeEditModal}
        />
      )}
      {showListaAsistentesModal && (
        <ListaAsistentes
          eventId={selectedEvent}
          setEvents={setFilteredEvents}
          onClose={closeListaAsistentesModal}
        />
      )}
      {/* Lista de Asistentes Modal */}
      {showAsistentesModal && (
        <AttendanceList
          eventId={selectedEvent}
          showModal={setShowAsistentesModal}
        />
      )}
    </div>
  );
};

export default EventsPage;