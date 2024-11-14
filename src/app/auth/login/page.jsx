'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, logout } = useAuth(); // Usa el contexto

  useEffect(() => {
    logout(); // Cerrar sesión al cargar la página
  }, []);


  const router = useRouter();

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

      // Redireccionar según el rol del usuario
      switch (data.role) {
        case "admin":
          router.push("/admin");
          break;
        case "student":
          router.push("/students");
          break;
        case "teacher":
          router.push("/teacher");
          break;
        case "superadmin":
          router.push("/superadmin");
          break;
        default:
          setError("Rol desconocido.");
          break;
      }
    } catch (err) {
      // Mostrar el error al usuario si ocurre algún problema en la solicitud
      setError(
        "Hubo un problema al conectarse con el servidor. Inténtalo más tarde."
      );
      console.error("Error en el login:", err);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center p-8"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1542296481-4ce13717ea85?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      <div className="bg-black bg-opacity-70 p-10 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-wider">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email:
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-700 rounded-lg bg-black text-gray-100 focus:ring-2 focus:ring-teal-400 focus:outline-none transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password:
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-700 rounded-lg bg-black text-gray-100 focus:ring-2 focus:ring-teal-400 focus:outline-none transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-teal-400 transition-all duration-300 focus:outline-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;