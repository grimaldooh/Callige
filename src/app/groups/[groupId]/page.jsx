'use client'
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; 
import { useAuth } from '@/app/context/AuthContext';
import AttendanceList from '../../../components/PublicGroupAttendance';

export default function EventAttendancePage() {
  const { userId, role, login } = useAuth();
  const [isTeacher, setIsTeacher] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const pathname = usePathname();
  const eventId = parseInt(pathname.split('/').pop());

  useEffect(() => {
    if (role === 'teacher') {
      setIsTeacher(true);
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Enviar datos de inicio de sesión al servidor para autenticación
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Si la respuesta no es exitosa, actualizamos el error en el estado para mostrarlo al usuario
      if (!response.ok) {
        setError(
          data.message ||
            "Error al iniciar sesión. Por favor, intenta de nuevo."
        );
        return; // Detener la ejecución si hay un error
      }

      // Guardar el token en localStorage
      localStorage.setItem("token", data.token);

      // Actualizar el contexto con los datos del usuario
      login(data.userId, data.schoolId, data.role);

    } catch (err) {
      // Mostrar el error al usuario si ocurre algún problema en la solicitud
      setError(
        "Hubo un problema al conectarse con el servidor. Inténtalo más tarde."
      );
      console.error("Error en el login:", err);
    }
  };

  const renderLogin = () => {
    if ((userId === null || userId === 0) || !isTeacher)  {
      console.log('userId:', userId);
      return (
        <div className="flex justify-center mt-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email:
              </label>
              <input
                type="email"
                className="w-full border-b border-gray-300 bg-transparent text-gray-600 focus:border-teal-400 focus:outline-none transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password:
              </label>
              <input
                type="password"
                className="w-full border-b border-gray-300 bg-transparent text-gray-600 focus:border-teal-400 focus:outline-none transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-1 rounded-lg font-medium shadow-sm hover:bg-teal-400 transition-all duration-300 focus:outline-none"
            >
              Login
            </button>
            <p className="text-center text-gray-500 text-sm mt-2">
              Es necesario hacer login para poder modificar la lista de asistencia.
            </p>
          </form>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 mt-4 text-center">
        Grupo {eventId}
      </h1>
      
      {userId === null || userId === 0 || !isTeacher ? (
        renderLogin()
      ) : (
        <AttendanceList eventId={eventId} />
      )}
    </div>
  );
}