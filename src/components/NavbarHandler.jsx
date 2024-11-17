'use client'

import React, { useEffect, useState } from 'react';
import SideNavbar from './SideNavbar';
import Navbar from './Navbar';

export default function NavbarHandler() {
  const [userRole, setUserRole] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verificar si estamos en el lado del cliente
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      setUserRole(role);

      // Verificar el tamaño de la ventana
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768); // Considerar móvil si el ancho es menor o igual a 768px
      };

      // Añadir evento de redimensionamiento
      window.addEventListener('resize', handleResize);

      // Verificar el tamaño inicial de la ventana
      handleResize();

      // Limpiar el evento de redimensionamiento al desmontar el componente
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const renderNavbar = () => {
    if(!userRole) return 

    if (isMobile || userRole === 'student') {
      return <Navbar />;
    } else if (userRole === 'admin' || userRole === 'superadmin' || userRole === 'teacher') {
      return <SideNavbar className="w-64" />;
    } else {
      return null;
    }
  };

  return <>{renderNavbar()}</>;
}
