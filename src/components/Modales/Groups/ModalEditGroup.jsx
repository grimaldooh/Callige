'use client';

import { useState, useEffect } from 'react';

const EditGroupModal = ({ groupId, onClose , setGroups, setCurrentGroup}) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Función para obtener los datos del grupo
    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/admin/findGroup?id=${groupId}`);
        const data = await response.json();
        console.log('Group data:', data);
        setGroup(data); // Establece los datos del grupo
      } catch (error) {
        console.error('Error fetching group:', error);
      }
    };

    if (groupId) {
      fetchGroup();
    }
  }, [groupId]);

  // Función para manejar los cambios en los inputs
  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const updatedClassDays = checked
        ? [...group.classDays, parseInt(value)]
        : group.classDays.filter((day) => day !== parseInt(value));
      setGroup({ ...group, classDays: updatedClassDays });
    } else {
      setGroup({ ...group, [name]: value });
    }
  };

  // Función para guardar los cambios
  const handleSave = async () => {
    console.log(group.classDays);
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/findGroup?id=${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: group.name,
          classDays: group.classDays,
        }),
      });

      if (response.ok) {
        const updatedGroup = await response.json();
        alert('Grupo actualizado correctamente');

        // Actualizar el estado de los grupos
        setGroups((prevGroups) =>
          prevGroups.map((g) => (g.id === groupId ? updatedGroup : g))
        );

        // Actualizar el estado del grupo actual
        setCurrentGroup(updatedGroup);

        onClose(); // Cierra la modal tras guardar los cambios
      } else {
        alert('Hubo un error al actualizar el grupo');
      }
    } catch (error) {
      console.error('Error updating group:', error);
      alert('Error al actualizar grupo');
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  if (!group) return <p>Cargando...</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center w-full">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Editar Grupo</h2>
        <label className="block mb-2">Nombre del grupo</label>
        <input
          type="text"
          name="name"
          value={group.name}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Días de Clase
        </label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((day, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                name="classDays"
                value={index}
                checked={group.classDays.includes(index)}
                onChange={handleChange}
                className="mr-2"
              />
              {day}
            </label>
          ))}
        </div>
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

export default EditGroupModal;