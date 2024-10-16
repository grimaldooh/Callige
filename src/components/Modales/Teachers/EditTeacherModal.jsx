'use client';

import { useState, useEffect } from 'react';

const EditTeacherModal = ({ teacherId, onClose }) => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga

  useEffect(() => {
    // Función para obtener los datos del profesor
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`/api/admin/findTeacher?id=${teacherId}`);
        const data = await response.json();
        console.log('Teacher data:', data);
        setTeacher(data); // Establece los datos del profesor
      } catch (error) {
        console.error('Error fetching teacher:', error);
      }
    };

    if (teacherId) {
      fetchTeacher();
    }
  }, [teacherId]);

  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  // Función para guardar los cambios
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/findTeacher?id=${teacherId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: teacher.name,
          email: teacher.email,
        }),
      });

      if (response.ok) {
        alert('Profesor actualizado correctamente');
        onClose(); // Cierra la modal tras guardar los cambios
      } else {
        alert('Hubo un error al actualizar el profesor');
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      alert('Error al actualizar profesor');
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  if (!teacher) return <p>Cargando...</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Editar Profesor</h2>
        <label className="block mb-2">Nombre</label>
        <input
          type="text"
          name="name"
          value={teacher.name}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />
        <label className="block mb-2">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={teacher.email}
          onChange={handleChange}
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

export default EditTeacherModal;