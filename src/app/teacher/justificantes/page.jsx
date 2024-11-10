'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

const TeacherJustificantesPage = () => {
  const { userId } = useAuth();
  const teacherId = userId;

  const [justificantes, setJustificantes] = useState([]);
  const [filteredJustificantes, setFilteredJustificantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResolved, setShowResolved] = useState(false);
  const [selectedJustificante, setSelectedJustificante] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (!teacherId) {
      return;
    }

    const fetchJustificantes = async () => {
      try {
        const response = await axios.get('/api/teacher/justificantes', {
          params: { teacherId },
        });
        setJustificantes(response.data.justificantes);
      } catch (error) {
        console.error('Error fetching justificantes:', error);
      }
    };

    fetchJustificantes();
  }, [teacherId]);

  useEffect(() => {
    filterJustificantes();
  }, [justificantes, searchTerm, showResolved]);

  const filterJustificantes = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = justificantes.filter(justificante => {
      const matchesSearchTerm = justificante.student.name
        .toLowerCase()
        .includes(lowerSearchTerm);
      
      const isPending = justificante.status === 2;
      const isResolved = showResolved && (justificante.status === 1 || justificante.status === 3);

      return matchesSearchTerm && (isPending || isResolved);
    });

    setFilteredJustificantes(filtered);
  };

  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return adjustedDate.toLocaleDateString();
  };

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const handleJustificanteAction = async (justificanteId, action) => {
    try {
      await axios.post('/api/teacher/attendanceStatus', {
        justificanteId,
        action,
      });
      setAlertMessage(`Justificante ${action === 'approved' ? 'aprobado' : 'rechazado'} exitosamente.`);
      setShowModal(false);
      setJustificantes(prevJustificantes =>
        prevJustificantes.filter(justificante => justificante.id !== justificanteId)
      );
    } catch (error) {
      console.error('Error updating justificante status:', error);
    }
  };

  const openConfirmationModal = (justificante, action) => {
    setSelectedJustificante(justificante);
    setActionType(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (selectedJustificante && actionType) {
      handleJustificanteAction(selectedJustificante.id, actionType);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mt-6 mb-4">Justificantes</h1>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre de estudiante..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />

      {/* Switch para mostrar justificantes resueltos */}
      <label className="flex items-center mb-4">
        <span className="mr-2">Mostrar justificantes resueltos</span>
        <div className="relative">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={() => setShowResolved(!showResolved)}
            className="sr-only"
          />
          <div
            className={`block w-14 h-8 rounded-full transition-colors ${
              showResolved ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
              showResolved ? 'transform translate-x-6' : ''
            }`}
          ></div>
        </div>
      </label>

      {/* Alerta */}
      {alertMessage && (
        <div className="bg-green-200 text-green-700 p-4 mb-4 rounded">
          {alertMessage}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {filteredJustificantes.length === 0 ? (
          <p>No hay justificantes para mostrar.</p>
        ) : (
          filteredJustificantes.map((justificante) => (
            <div
              key={justificante.id}
              className={`flex items-center rounded-lg shadow-lg p-6 max-w-4xl mx-auto ${justificante.status === 1 ? 'bg-green-100' : justificante.status === 3 ? 'bg-red-100' : 'bg-gray-100'} mt-4`}
            >
              {/* Imagen del estudiante */}
              <img
                src={justificante.student.imageUrl || "/placeholder-image.jpg"}
                alt="Estudiante"
                className="h-32 w-32 object-cover rounded-full"
              />

              {/* Detalles del justificante */}
              <div className="ml-6 flex-1">
                <p className="text-lg font-semibold">
                  {justificante.razon} - {formattedDate(justificante.fecha)}
                </p>
                <p className="text-gray-600 mt-2 break-words max-w-full">
                  <span className="font-bold">Descripción:</span> {justificante.descripcion}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-bold">Estudiante:</span> {justificante.student.name}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-bold">Grupo:</span> {justificante.group.name}
                </p>

                {/* Botones para aprobar o rechazar */}
                {justificante.status === 2 && (
                  <div className="mt-4">
                    <button
                      onClick={() => openConfirmationModal(justificante, "approved")}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => openConfirmationModal(justificante, "rejected")}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>

              {/* Imagen del justificante */}
              <div className="ml-6 text-center">
                {justificante.imageUrl ? (
                  <>
                    <img
                      src={justificante.imageUrl}
                      alt="Justificante"
                      className="h-32 w-32 object-cover cursor-pointer border-2 border-gray-300 rounded-lg"
                      onClick={() => handleImageClick(justificante.imageUrl)}
                    />
                    <p
                      className="text-blue-500 mt-2 cursor-pointer"
                      onClick={() => handleImageClick(justificante.imageUrl)}
                    >
                      Descargar Justificante
                    </p>
                  </>
                ) : (
                  <>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/5087/5087113.png"
                      alt="Imagen no disponible"
                      className="h-32 w-32 object-cover border-2 border-gray-300"
                    />
                    <p className="text-gray-500 mt-2">No se envió justificante</p>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4">
              ¿Estás seguro que deseas {actionType === "approved" ? "aprobar" : "rechazar"} este justificante?
            </p>
            <div className="flex justify-end">
              <button
                onClick={confirmAction}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherJustificantesPage;