'use client';

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { MenuIcon, XIcon, LogoutIcon, UserGroupIcon, UserIcon, HomeIcon, NewspaperIcon, UsersIcon, DocumentReportIcon} from '@heroicons/react/solid';
import axios from 'axios';

export default function Navbar({ className }) {
  const { role, logout, userId} = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/admin'); // Default to '/admin'
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
          console.log('teacherId:', teacherId);
        const response = await axios.get('/api/teacher/justificantes', {
          params: {
            teacherId,
          },
        });
        const { data } = response;
        const justificantesPendientes = data.justificantes.filter(justificante => justificante.status === 2);
        console.log('data:', data.justificantes.length);
        setJustificantesCount(justificantesPendientes.length);
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
    setCurrentPath(window.location.pathname);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLinkClick = (path) => {
    setCurrentPath(path);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
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
      case "admin":
        return (
          <>
            <li>
              <Link
                href="/admin"
                onClick={() => handleLinkClick("/admin")}
                className={`flex items-center p-2 ${
                  currentPath === "/admin" ? "text-blue-500" : "text-gray-700"
                } hover:bg-blue-50 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/students"
                onClick={() => handleLinkClick("/admin/students")}
                className={`flex items-center p-2 ${
                  currentPath === "/admin/students" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-300 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
              >
                <UserIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Alumnos</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/teachers"
                onClick={() => handleLinkClick("/admin/teachers")}
                className={`flex items-center p-2 ${
                  currentPath === "/admin/teachers" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-300 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
              >
                <UsersIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Profesores</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/groups"
                onClick={() => handleLinkClick("/admin/groups")}
                className={`flex items-center p-2 ${
                  currentPath === "/admin/groups" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-300 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
              >
                <UserGroupIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Grupos</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/events"
                onClick={() => handleLinkClick("/admin/events")}
                className={`flex items-center p-2 ${
                  currentPath === "/admin/events" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-300 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
              >
                <NewspaperIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Eventos</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/stats"
                onClick={() => handleLinkClick("/admin/stats")}
                className={`flex items-center p-2 ${
                  currentPath === "/admin/stats" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-300 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
              >
                <DocumentReportIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Estadísticas</span>
              </Link>
            </li>
          </>
        );
      case "teacher":
        return (
          <>
            <li>
              <Link
                href="/teacher"
                onClick={() => handleLinkClick("/teacher")}
                className={`flex items-center p-2 ${
                  currentPath === "/teacher" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-300 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
              >
                <MenuIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/teacher/events"
                onClick={() => handleLinkClick("/teacher/events")}
                className={`flex items-center p-2 ${
                  currentPath === "/teacher/events" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-300 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
              >
                <NewspaperIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Eventos</span>
              </Link>
            </li>
            <li>
              <Link
                href="/teacher/groups"
                onClick={() => handleLinkClick("/teacher/groups")}
                className={`flex items-center p-2 ${
                  currentPath === "/teacher/groups" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-300 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700 relative`}
              >
                <UserGroupIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Grupos</span>
              </Link>
            </li>
            <li>
              <Link
                href="/teacher/justificantes"
                onClick={() => handleLinkClick("/teacher/justificantes")}
                className={`flex items-center p-2 ${
                  currentPath === "/teacher/justificantes" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-300 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700 relative`}
              >
                <DocumentReportIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Justificantes</span>
                <span className="absolute top-0 right-4 mr-5 mt-1 ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {justificantesCount}
                </span>
              </Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };
  


  return (
    <>
      {userId && (
        <div
          className={` w-64 h-screen p-4 bg-gray-600 dark:bg-gray-800 ${className}`}
        >
          <button
            onClick={toggleDrawer}
            className="text-gray-100 bg-gray-300 hover:bg-gray-300 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm p-3 inline-flex items-center justify-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-green-800"
          >
            <MenuIcon className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Drawer Component */}
          {isDrawerOpen && (
            <div
              id="drawer-navigation"
              className="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform transform bg-gray-200 dark:bg-gray-800"
              tabIndex="-1"
            >
              <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
                Dashboard
              </h5>

              <ul className="space-y-2 font-medium mt-4">{renderLinks()}</ul>
              <button
                onClick={openLogoutModal}
                className="flex items-center text-red-500 mt-8 hover:text-red-700"
              >
                <LogoutIcon className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          )}

          {/* Logout Modal */}
          {isLogoutModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Cerrar Sesión
                </h2>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  ¿Estás seguro de que deseas cerrar sesión?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={confirmLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Sí
                  </button>
                  <button
                    onClick={closeLogoutModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}