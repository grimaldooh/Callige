'use client'

import { useContext, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
export default function Navbar() {

  const { role } = useAuth();
  const [isBurgerOpen, setIsBurgerOpen] = useState(false); // Para controlar el menú en móviles

  const toggleBurgerMenu = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  const renderLinks = () => {
    switch (role) {
      case 'admin':
        return (
          <>
            <li><Link href="/admin">Home</Link></li>
            <li><Link href="/admin/students">Alumnos</Link></li>
            <li><Link href="/admin/teachers">Profesores</Link></li>
            <li><Link href="/admin/groups">Grupos</Link></li>
            <li><Link href="/admin/events">Eventos</Link></li>
          </>
        );
      case 'teacher':
        return (
          <>
            <li><Link href="/teacher">Home</Link></li>
            <li><Link href="/teacher/justificantes">Justificantes</Link></li>
            <li><Link href="/teacher/attendance">Capturar Asistencia</Link></li>
          </>
        );
      case 'student':
        return (
          <>
            <li><Link href="/students">Home</Link></li>
            <li><Link href="/students/events">Eventos</Link></li>
            <li><Link href="/students/groups">Grupos</Link></li>
            <li><Link href="/students/justificantes">Justificantes</Link></li>
          </>
        );
      case 'superadmin':
        return (
          <>
            <li><Link href="/superadmin">SuperAdmin</Link></li>
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
    </nav>
  );
}