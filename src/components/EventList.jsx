'use client'

import React from 'react';

const EventList = ({ events, onAttendClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <div
          key={event.id}
          className="event-card bg-white shadow-lg rounded-lg overflow-hidden"
        >
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
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => onAttendClick(event)}
            >
              Asistir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;