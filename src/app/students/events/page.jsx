'use client'

import React, { useState, useEffect } from 'react';
import EventList from '../../../components/EventList';
import { useAuth } from '../../context/AuthContext';

const EventsPage = () => {
  const { schoolId } = useAuth();
  const globalSchoolId = schoolId;

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!globalSchoolId) return; // No hacer nada si no hay schoolId
    const fetchEvents = async () => {
      try {
        if (!globalSchoolId) {
          console.log('globalSchoolId is not defined');
          return;
        }
        const response = await fetch(`/api/admin/events?schoolId=${globalSchoolId}`);
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [globalSchoolId]);

  const handleAttendClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const confirmAttendance = async (eventId) => {
    try {
      const response = await fetch('/api/student/linkEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: 14,  // El ID del estudiante actualmente está fijo en 14
          eventId: eventId,
        }),
      });
  
      if (response.ok) {
        alert('Asistencia confirmada con éxito');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        alert('Hubo un error al confirmar la asistencia');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al conectar con el servidor');
    }
  };

  const handleConfirm = () => {
    // Lógica de confirmación por implementar
    confirmAttendance(selectedEvent.id);
    setShowModal(false);
    //alert('Asistencia confirmada');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">Próximos Eventos</h1>
      
      {/* Invocar el componente EventList y pasarle los eventos */}
      <EventList events={events} onAttendClick={handleAttendClick} />

      {/* Modal personalizada */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">
              ¿Confirmas tu asistencia a "{selectedEvent?.name}"?
            </h2>
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleConfirm}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;