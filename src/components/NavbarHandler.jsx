'use client'

import React, { useEffect, useState } from 'react';
import SideNavbar from './SideNavbar';
import Navbar from './Navbar';

export default function NavbarHandler() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Verificar si estamos en el lado del cliente
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      setUserRole(role);
    }
  }, []);

  const renderNavbar = () => {
    if (userRole === 'admin' || userRole === 'superadmin' || userRole === 'teacher') {
      return <SideNavbar className="w-64" />;
    } else {
      return <Navbar />;
    }
  };

  return <>{renderNavbar()}</>;
}
