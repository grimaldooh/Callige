// components/Modales/ModalEventDetails.jsx
import React from 'react';

const ModalEventDetails = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-semibold mb-4">{event.name}</h2>
        <p><strong>Descripción:</strong> {event.description}</p>
        <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Ubicación:</strong> {event.location}</p>
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

export default ModalEventDetails;