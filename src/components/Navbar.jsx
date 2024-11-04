import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';

export default function Navbar() {
  const { role, logout, userId } = useAuth();
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [teacherId, setTeacherId] = useState(null);
  const [justificantesCount, setJustificantesCount] = useState(0);

  useEffect(() => {
    if (role === 'teacher') setTeacherId(userId);
  }, [role, userId]);

  useEffect(() => {
    if (!teacherId) return;
    const fetchJustificantes = async () => {
      try {
        const response = await axios.get('/api/teacher/justificantes', { params: { teacherId } });
        setJustificantesCount(response.data.justificantes.length);
      } catch (error) {
        console.error('Error fetching justificantes:', error);
      }
    };
    fetchJustificantes();
  }, [teacherId]);

  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleBurgerMenu = () => setIsBurgerOpen(!isBurgerOpen);

  const handleLinkClick = (path) => {
    setCurrentPath(path);
    setIsBurgerOpen(false);
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const confirmLogout = () => {
    logout();
    closeLogoutModal();
  };

  const renderLinks = () => {
    const linkClasses = (path) => (currentPath === path ? 'text-blue-500' : 'text-gray-600');
    
    switch (role) {
      case 'admin':
        return (
          <>
            <li><Link href="/admin" className={linkClasses('/admin')} onClick={() => handleLinkClick('/admin')}>Home</Link></li>
            <li><Link href="/admin/students" className={linkClasses('/admin/students')} onClick={() => handleLinkClick('/admin/students')}>Alumnos</Link></li>
            <li><Link href="/admin/teachers" className={linkClasses('/admin/teachers')} onClick={() => handleLinkClick('/admin/teachers')}>Profesores</Link></li>
            <li><Link href="/admin/groups" className={linkClasses('/admin/groups')} onClick={() => handleLinkClick('/admin/groups')}>Grupos</Link></li>
            <li><Link href="/admin/events" className={linkClasses('/admin/events')} onClick={() => handleLinkClick('/admin/events')}>Eventos</Link></li>
            <li><Link href="/admin/stats" className={linkClasses('/admin/stats')} onClick={() => handleLinkClick('/admin/stats')}>Estadísticas</Link></li>

          </>
        );
      case 'teacher':
        return (
          <>
            <li><Link href="/teacher" className={linkClasses('/teacher')} onClick={() => handleLinkClick('/teacher')}>Home</Link></li>
            <li><Link href="/teacher/events" className={linkClasses('/teacher/events')} onClick={() => handleLinkClick('/teacher/events')}>Eventos</Link></li>
            <li><Link href="/teacher/groups" className={linkClasses('/teacher/groups')} onClick={() => handleLinkClick('/teacher/groups')}>Grupos</Link></li>
            <li className="relative">
              <Link href="/teacher/justificantes" className={linkClasses('/teacher/justificantes')} onClick={() => handleLinkClick('/teacher/justificantes')}>Justificantes</Link>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                {justificantesCount}
              </span>
            </li>
          </>
        );
      case 'student':
        return (
          <>
            <li><Link href="/students" className={linkClasses('/students')} onClick={() => handleLinkClick('/students')}>Home</Link></li>
            <li><Link href="/students/events" className={linkClasses('/students/events')} onClick={() => handleLinkClick('/students/events')}>Eventos</Link></li>
            <li><Link href="/students/groups" className={linkClasses('/students/groups')} onClick={() => handleLinkClick('/students/groups')}>Grupos</Link></li>
            <li><Link href="/students/justificantes" className={linkClasses('/students/justificantes')} onClick={() => handleLinkClick('/students/justificantes')}>Justificantes</Link></li>
            <li><Link href="/students/eventsAttendance" className={linkClasses('/students/eventsAttendance')} onClick={() => handleLinkClick('/students/eventsAttendance')}>Asistencia de Eventos</Link></li>
          </>
        );
      case 'superadmin':
        return (
          <li><Link href="/superadmin" className={linkClasses('/superadmin')} onClick={() => handleLinkClick('/superadmin')}>SuperAdmin</Link></li>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex items-center justify-between p-4 mx-auto">
        <button
          onClick={toggleBurgerMenu}
          className="inline-flex items-center p-2 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-sticky"
          aria-expanded={isBurgerOpen}
        >
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className={`w-full md:flex md:w-auto ${isBurgerOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
          <ul className="flex flex-col p-4 space-y-4 font-medium bg-gray-50 rounded-lg md:space-x-8 md:space-y-0 md:flex-row md:bg-white dark:bg-gray-800">
            {renderLinks()}
            {role && (
              <li>
                <button onClick={openLogoutModal} className="text-red-500 px-4 py-2 rounded hover:bg-red-600">Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">¿Estás seguro de que quieres cerrar sesión?</h3>
            <div className="flex justify-end space-x-4">
              <button onClick={confirmLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Confirmar</button>
              <button onClick={closeLogoutModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}