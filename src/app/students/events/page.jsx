'use client'

import React, { useState, useEffect } from 'react';
import EventList from '../../../components/EventList';
import { useAuth } from '../../context/AuthContext';

const EventsPage = () => {
  const { schoolId, userId } = useAuth();
  const studentId = userId;
  const globalSchoolId = schoolId;

  const [events, setEvents] = useState([]);
  const [linkedEvents, setLinkedEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!globalSchoolId) return;

    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/admin/events?schoolId=${globalSchoolId}`);
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchLinkedEvents = async () => {
      try {
        const response = await fetch(`/api/student/linkedEvents?studentId=${studentId}`);
        const data = await response.json();
        setLinkedEvents(data.events);
      } catch (error) {
        console.error('Error fetching linked events:', error);
      }
    };

    fetchEvents();
    fetchLinkedEvents();
  }, [globalSchoolId]);

  const handleAttendClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCancelClick = async (eventId) => {
    try {
      const response = await fetch('/api/student/unlinkEvent', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId,  // ID del estudiante
          eventId: eventId,
        }),
      });

      if (response.ok) {
        alert('Asistencia cancelada');
        setLinkedEvents(linkedEvents.filter(event => event.id !== eventId));
      } else {
        alert('Error al cancelar la asistencia');
      }
    } catch (error) {
      console.error('Error canceling attendance:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('/api/student/linkEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId,  // El ID del estudiante
          eventId: selectedEvent.id,
        }),
      });

      if (response.ok) {
        alert('Asistencia confirmada');
        setLinkedEvents([...linkedEvents, selectedEvent]);
      } else {
        alert('Error al confirmar la asistencia');
      }
    } catch (error) {
      console.error('Error confirming attendance:', error);
    }
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">Próximos Eventos</h1>

      <EventList
        events={events}
        linkedEvents={linkedEvents}
        onAttendClick={handleAttendClick}
        onCancelClick={handleCancelClick}
      />

      {/* Modal para confirmar asistencia */}
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