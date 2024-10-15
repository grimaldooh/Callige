// components/JustificationModal.tsx
'use client';

import { useState } from 'react';

const JustificationModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!reason || !description) {
      alert('Razón y descripción son obligatorias');
      return;
    }

    onSubmit({ reason, description, image });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Formulario de Justificante</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Razón</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Seleccionar razón</option>
            <option value="Cita médica">Cita médica</option>
            <option value="Falla en sistema">Falla en sistema</option>
            <option value="Razón personal">Razón personal</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Subir imagen (opcional)</label>
          <input
            type="file"
            className="w-full"
            onChange={handleImageUpload}
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default JustificationModal;