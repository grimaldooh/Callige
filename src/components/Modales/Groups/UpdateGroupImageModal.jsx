// components/Modales/Events/UpdateGruopImageModal.jsx
'use client';

import React, { useState } from 'react';

const ChangeImageModal = ({ groupId, onClose, onImageUpdated }) => {
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('groupId', groupId);

    try {
      const response = await fetch('/api/group/updateImage', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const updatedGroup = await response.json();
        onImageUpdated(updatedGroup.imageUrl); // Notificar al componente padre
        onClose(); // Cerrar el modal
      } else {
        console.error('Error updating image');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-md">
        <h2 className="text-xl font-bold mb-4">Cambiar Imagen del Grupo</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeImageModal;