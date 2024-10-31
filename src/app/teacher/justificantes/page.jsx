'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {useAuth} from '../../context/AuthContext';

const TeacherJustificantesPage = () => {
  const {userId} = useAuth();
  const teacherId = userId; 
  console.log('teacherId:', teacherId);

  const [justificantes, setJustificantes] = useState([]);
  const [selectedJustificante, setSelectedJustificante] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (!teacherId) {
        console.log('teacherId no está disponible');
        return; // No hace la solicitud si teacherId es null o undefined
      }
    const fetchJustificantes = async () => {
      try {
        if (!teacherId) {
            console.log('teacherId is not defined');
            return;
          }
        const response = await axios.get('/api/teacher/justificantes', {
          params: {
            teacherId,
          },
        });
        const { data } = response;
        setJustificantes(data.justificantes);
      } catch (error) {
        console.error('Error fetching justificantes:', error);
      }
    };

    fetchJustificantes();
  }, [teacherId]);

  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    const adjustedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
    return adjustedDate.toLocaleDateString();
  };

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const handleJustificanteAction = async (justificanteId, action) => {
    try {
      const response = await axios.post('/api/teacher/attendanceStatus', {
        justificanteId,
        action,
      });
      console.log('Response:', response.data);
      setAlertMessage(`Justificante ${action === 'approved' ? 'aprobado' : 'rechazado'} exitosamente.`);
      setShowModal(false);
      // Actualizar el estado de los justificantes para quitar el justificante procesado
      setJustificantes((prevJustificantes) =>
      prevJustificantes.filter((justificante) => justificante.id !== justificanteId)
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
      <h1 className="text-2xl font-bold mt-20 mb-4">
        Justificantes Pendientes
      </h1>

      {/* Alerta */}
      {alertMessage && (
        <div className="bg-green-200 text-green-700 p-4 mb-4 rounded">
          {alertMessage}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {Array.isArray(justificantes) && justificantes.length === 0 ? (
          <p>No hay justificantes pendientes.</p>
        ) : (
          Array.isArray(justificantes) &&
          justificantes.map((justificante) => (
            <div
              key={justificante.id}
              className="flex items-center bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto"
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
                  <span className="font-bold">Descripción:</span>{" "}
                  {justificante.descripcion}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-bold">Estudiante:</span>{" "}
                  {justificante.student.name}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-bold">Grupo:</span>{" "}
                  {justificante.group.name}
                </p>

                {/* Botones para aprobar o rechazar */}
                <div className="mt-4">
                  <button
                    onClick={() =>
                      openConfirmationModal(justificante, "approved")
                    }
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() =>
                      openConfirmationModal(justificante, "rejected")
                    }
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                  >
                    Rechazar
                  </button>
                </div>
              </div>

              {/* Imagen del justificante */}
              <div className="ml-6 text-center">
                {justificante.imageUrl ? (
                  <>
                    <img
                      src={justificante.imageUrl}
                      alt="Justificante"
                      className="h-32 w-32 object-cover cursor-pointer border-2 border-gray-300"
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
              ¿Estás seguro que deseas{" "}
              {actionType === "approved" ? "aprobar" : "rechazar"} este
              justificante?
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