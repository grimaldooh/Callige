'use client';

import { useState, useEffect } from 'react';

const EditStudentModal = ({ studentId, onClose , setStudents}) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga

  useEffect(() => {
    // Función para obtener los datos del estudiante
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/admin/findStudent?id=${studentId}`);
        const data = await response.json();
        console.log('Student data:', data);
        setStudent(data); // Establece los datos del estudiante
      } catch (error) {
        console.error('Error fetching student:', error);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // Función para guardar los cambios
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/findStudent?id=${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: student.name,
          email: student.email,
        }),
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        alert('Estudiante actualizado correctamente');
        setStudents((prevStudents) =>
          prevStudents.map((s) => (s.id === studentId ? updatedStudent : s))
        );
        onClose(); // Cierra la modal tras guardar los cambios
      } else {
        alert('Hubo un error al actualizar el estudiante');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error al actualizar estudiante');
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  if (!student) return <p>Cargando...</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Editar Estudiante</h2>
        <label className="block mb-2">Nombre</label>
        <input
          type="text"
          name="name"
          value={student.name}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />
        <label className="block mb-2">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={student.email}
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

export default EditStudentModal;