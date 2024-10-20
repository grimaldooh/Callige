'use client';

import { set } from 'date-fns';
import { useState, useEffect } from 'react';

const EditEventModal = ({ eventId, onClose, setEvents }) => {
  const [event, setEvent] = useState(null);
  const [image, setImage] = useState(null); // Para manejar la imagen seleccionada
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga

  useEffect(() => {
    // Función para obtener los datos del evento
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/admin/findEvent?id=${eventId}`);
        const data = await response.json();
        console.log('Event data:', data);
        setEvent(data); // Establece los datos del evento
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  // Función para manejar la selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file); // Guarda el archivo seleccionado en el estado
  };

  const formatDate = (date) => {
    const formattedDate = event.date.split('T')[0];
    return formattedDate;
    };
    

  // Función para guardar los cambios
  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append('id', event.id);
    console.log('event.id:', event.id);
    formData.append('name', event.name);
    console.log('event.name:', event.name);
    formData.append('description', event.description);
    console.log('event.description:', event.description);
    formData.append('date', event.date);
    console.log('event.date:', event.date);

    formData.append('location', event.location);
    console.log('event.location:', event.location);
    if (image) {
      formData.append('image', image); // Añadir la imagen al FormData si se ha seleccionado una
    }
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }  

    console.log('formData:', formData);
    try {
      const response = await fetch(`/api/admin/findEvent`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        alert('Evento actualizado correctamente');
        setEvents((prevEvents) =>
          prevEvents.map((e) => (e.id === event.id ? updatedEvent : e))
        );
        onClose(); // Cierra la modal tras guardar los cambios
      } else {
        alert('Hubo un error al actualizar el evento');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error al actualizar evento');
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  if (!event) return <p>Cargando...</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Editar Evento</h2>
        <label className="block mb-2">Nombre</label>
        <input
          type="text"
          name="name"
          value={event.name}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />
        <label className="block mb-2">Descripción</label>
        <input
          type="text"
          name="description"
          value={event.description}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />
        <label className="block mb-2">Fecha</label>
        <input
          type="date"
          name="date"
          value={formatDate(event.date)}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />
        <label className="block mb-2">Ubicación</label>
        <input
          type="text"
          name="location"
          value={event.location}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />
        <label className="block mb-2">Imagen (opcional)</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 w-full mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;