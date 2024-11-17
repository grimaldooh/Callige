import React, { useEffect, useState } from 'react';
import { useAuth } from '../../app/context/AuthContext';

const EditSchoolPeriod = ({isOpen, onClose}) => {
  if (!isOpen) return null;

  const { schoolId: globalSchoolId } = useAuth(); // Obtener schoolId desde el contexto
  const [isModalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const handleOpenModal = async () => {
    try {
      // Obtener los datos actuales de la escuela
      const response = await fetch(`/api/schools?schoolId=${globalSchoolId}`);
      if (response.ok) {
        const { startDate, endDate } = await response.json();
        setStartDate(startDate ? startDate.split('T')[0] : ''); // Convertir a formato YYYY-MM-DD
        setEndDate(endDate ? endDate.split('T')[0] : '');
        console.log('tudo bom')
      } else {
        console.error('Error al obtener los datos de la escuela');
      }
    } catch (error) {
      console.error('Error al abrir el modal:', error);
    }

    //setModalOpen(true);
  };

  useEffect(() => {
    if(!globalSchoolId) return;
    handleOpenModal()
  } , [globalSchoolId]);

  const handleCloseModal = () => {
    onClose()
  };

  const handleSavePeriod = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/schools?schoolId=${globalSchoolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        console.log('Período escolar actualizado correctamente');
        //setModalOpen(false);
        onClose();
        alert('Periodo actualizado exitosamente.')

      } else {
        console.error('Error al actualizar el período escolar');
      }
    } catch (error) {
      console.error('Error al guardar el período:', error);
    }
  };

  return (
    <div>


      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Editar Período Escolar</h2>
            <form onSubmit={handleSavePeriod}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSchoolPeriod;