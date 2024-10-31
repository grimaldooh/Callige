'use client';

import { useContext, useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { set } from 'date-fns';
import axios from 'axios';

export default function Navbar() {
  const { role, logout, userId } = useAuth();
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [teacherId, setTeacherId] = useState(null);
  const [justificantesCount, setJustificantesCount] = useState(0);

  

  useEffect(() => {
    
    console.log('teacherId:', teacherId);
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
        console.log('data:', data.justificantes.length);
        setJustificantesCount(data.justificantes.length);
      } catch (error) {
        console.error('Error fetching justificantes:', error);
      }
    };

    fetchJustificantes();
  }, [teacherId]);

  useEffect(() => {
    console.log('role:', role);
    if (role === 'teacher') {
      setTeacherId(userId);
    }
  }, [role]);
    

  useEffect(() => {
    
    // Inicializa el path actual
    setCurrentPath(window.location.pathname);

    // Función para actualizar el path al navegar
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    // Escucha el evento popstate
    window.addEventListener('popstate', handlePopState);

    // Cleanup al desmontar el componente
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const toggleBurgerMenu = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const confirmLogout = () => {
    logout();
    closeLogoutModal();
  };

  const renderLinks = () => {
    switch (role) {
      case 'admin':
        return (
          <>
            <li><Link href="/admin" className={currentPath === '/admin' ? 'text-blue-500' : ''}>Home</Link></li>
            <li><Link href="/admin/students" className={currentPath === '/admin/students' ? 'text-blue-500' : ''}>Alumnos</Link></li>
            <li><Link href="/admin/teachers" className={currentPath === '/admin/teachers' ? 'text-blue-500' : ''}>Profesores</Link></li>
            <li><Link href="/admin/groups" className={currentPath === '/admin/groups' ? 'text-blue-500' : ''}>Grupos</Link></li>
            <li><Link href="/admin/events" className={currentPath === '/admin/events' ? 'text-blue-500' : ''}>Eventos</Link></li>
          </>
        );
      case 'teacher':
        return (
          <>
            <li>
              <Link
                href="/teacher"
                className={currentPath === "/teacher" ? "text-blue-500" : ""}
              >
                Home
              </Link>
            </li>
            <li className="relative">
              <Link
                href="/teacher/justificantes"
                className={
                  currentPath === "/teacher/justificantes"
                    ? "text-blue-500"
                    : ""
                }
              >
                Justificantes
              </Link>
              <span className="absolute top-0 mr-4 inline-flex px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/4">
                {justificantesCount}
              </span>
            </li>{" "}
          </>
        );
      case 'student':
        return (
          <>
            <li><Link href="/students" className={currentPath === '/students' ? 'text-blue-500' : ''}>Home</Link></li>
            <li><Link href="/students/events" className={currentPath === '/students/events' ? 'text-blue-500' : ''}>Eventos</Link></li>
            <li><Link href="/students/groups" className={currentPath === '/students/groups' ? 'text-blue-500' : ''}>Grupos</Link></li>
            <li><Link href="/students/justificantes" className={currentPath === '/students/justificantes' ? 'text-blue-500' : ''}>Justificantes</Link></li>
            <li><button onClick={openLogoutModal} className=" text-red-500  rounded hover:bg-red-600  align-baseline " >Logout</button></li>
          </>
        );
      case 'superadmin':
        return (
          <>
            <li><Link href="/superadmin" className={currentPath === '/superadmin' ? 'text-blue-500' : ''}>SuperAdmin</Link></li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Botón para menú móvil */}
        <div className="flex md:order-2">
          {role && role !== 'student' && (
            <button
              onClick={openLogoutModal} // Abrir la modal de confirmación
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}

          {role === 'student' && (
            <button
              onClick={toggleBurgerMenu}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded={isBurgerOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14" aria-hidden="true">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          )}
        </div>

        {/* Enlaces de navegación */}
        <div className={`items-center justify-between ${isBurgerOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {renderLinks()}
          </ul>
        </div>
      </div>

      {/* Modal de confirmación */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50 p-10">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">¿Estás seguro de que quieres cerrar sesión?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirmar
              </button>
              <button
                onClick={closeLogoutModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}