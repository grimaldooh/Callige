import { useState, useEffect } from 'react';

const LinkTeacherEventModal = ({ teacherId, onClose }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all Events for the school with ID 1
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?schoolId=1');
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data); // Inicialmente muestra todos
      } catch (error) {
        console.error("Error fetching Events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Filtrar grupos por el término de búsqueda
  useEffect(() => {
    const filtered = events.filter(event => 
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const handleLinkEvent = async (eventId) => {
    try {
      const response = await fetch('/api/event/linkTeacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId, eventId }),
      });

      if (response.ok) {
        alert('Profesor vinculado al grupo correctamente');
        onClose(); // Cerrar la modal tras vincular
      } else {
        alert('Error al vincular al profesor');
      }
    } catch (error) {
      console.error('Error linking teacher to event:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-semibold mb-4">Vincular profesor a un grupo</h2>
        <input
          type="text"
          placeholder="Buscar grupos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        <ul className="max-h-60 overflow-y-auto">
          {filteredEvents.map(event => (
            <li key={event.id} className="flex justify-between items-center mb-2">
              <span>{event.name}</span>
              <button 
                onClick={() => handleLinkEvent(event.id)} 
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Vincular
              </button>
            </li>
          ))}
        </ul>
        <button 
          onClick={onClose} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default LinkTeacherEventModal;
