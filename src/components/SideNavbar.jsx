'use client';

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { MenuIcon, XIcon, LogoutIcon, UserGroupIcon, UserIcon, HomeIcon, NewspaperIcon, UsersIcon } from '@heroicons/react/solid';

export default function Navbar({ className }) {
  const { role, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/admin'); // Default to '/admin'

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
      case 'admin':
        return (
          <>
            <li>
              <Link href="/admin">
                <li
                  onClick={() => handleLinkClick('/admin')}
                  className={`flex items-center p-2 ${currentPath === '/admin' ? 'text-blue-500' : 'text-gray-700'} hover:bg-gray-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Home</span>
                </li>
              </Link>
            </li>
            <li>
              <Link href="/admin/students">
                <li
                  onClick={() => handleLinkClick('/admin/students')}
                  className={`flex items-center p-2 ${currentPath === '/admin/students' ? 'text-blue-500' : 'text-gray-700'} hover:bg-gray-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Alumnos</span>
                </li>
              </Link>
            </li>
            <li>
              <Link href="/admin/teachers">
                <li
                  onClick={() => handleLinkClick('/admin/teachers')}
                  className={`flex items-center p-2 ${currentPath === '/admin/teachers' ? 'text-blue-500' : 'text-gray-700'} hover:bg-gray-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
                >
                  <UsersIcon className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Profesores</span>
                </li>
              </Link>
            </li>
            <li>
              <Link href="/admin/groups">
                <li
                  onClick={() => handleLinkClick('/admin/groups')}
                  className={`flex items-center p-2 ${currentPath === '/admin/groups' ? 'text-blue-500' : 'text-gray-700'} hover:bg-gray-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Grupos</span>
                </li>
              </Link>
            </li>
            <li>
              <Link href="/admin/events">
                <li
                  onClick={() => handleLinkClick('/admin/events')}
                  className={`flex items-center p-2 ${currentPath === '/admin/events' ? 'text-blue-500' : 'text-gray-700'} hover:bg-gray-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
                >
                  <NewspaperIcon className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Eventos</span>
                </li>
              </Link>
            </li>
          </>
        );
      case 'teacher':
        return (
          <>
            <li>
              <Link href="/teacher">
                <li
                  onClick={() => handleLinkClick('/teacher')}
                  className={`flex items-center p-2 ${currentPath === '/teacher' ? 'text-blue-500' : 'text-gray-700'} hover:bg-gray-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
                >
                  <MenuIcon className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Dashboard</span>
                </li>
              </Link>
            </li>
            <li>
              <Link href="/teacher/groups">
                <li
                  onClick={() => handleLinkClick('/teacher/groups')}
                  className={`flex items-center p-2 ${currentPath === '/teacher/groups' ? 'text-blue-500' : 'text-gray-700'} hover:bg-gray-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700`}
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Grupos</span>
                </li>
              </Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`h-screen p-4 bg-gray-100 dark:bg-gray-800 ${className}`}>
      <button onClick={toggleDrawer} className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm p-3 inline-flex items-center justify-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-green-800">
        <MenuIcon className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Drawer Component */}
      {isDrawerOpen && (
        <div id="drawer-navigation" className="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform transform bg-gray-100 dark:bg-gray-800" tabIndex="-1">
          <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Dashboard</h5>
          <button onClick={toggleDrawer} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <XIcon className="w-5 h-5" aria-hidden="true" />
            <span className="sr-only">Close menu</span>
          </button>
          <ul className="space-y-2 font-medium mt-4">
            {renderLinks()}
          </ul>
          <button onClick={openLogoutModal} className="flex items-center text-red-500 mt-8 hover:text-red-700">
            <LogoutIcon className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      )}

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md dark:bg-gray-800">
            <p className="mb-4 text-gray-700 dark:text-gray-200">¿Estás seguro de que deseas cerrar sesión?</p>
            <button onClick={confirmLogout} className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-700">Sí</button>
            <button onClick={closeLogoutModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">No</button>
          </div>
        </div>
      )}
    </div>
  );
}