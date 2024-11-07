'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // Importamos js-cookie para manejar las cookies
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [schoolId, setSchoolId] = useState(null);
  const [role, setRole] = useState('');
  const [tempStudentId, setTempStudentId] = useState(null);
  const router = useRouter();

  // Cargar los datos desde localStorage al iniciar
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedSchoolId = localStorage.getItem('schoolId');
    const storedRole = localStorage.getItem('role');

    console.log('storedUserId:', storedUserId);

    if (storedUserId && storedSchoolId && storedRole) {
      setUserId(storedUserId);
      setSchoolId(storedSchoolId);
      setRole(storedRole);
    }
  }, []);

  const setTempStudent = (id) => {
    setTempStudentId(id);
    localStorage.setItem('tempStudentId', id);
  }

  const login = (id, schoolId, role) => {
    setUserId(id);
    setSchoolId(schoolId);
    setRole(role);

    // Guardar en localStorage
    localStorage.setItem('userId', id);
    localStorage.setItem('schoolId', schoolId);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setUserId(null);
    setSchoolId(null);
    setRole('');

    // Limpiar localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('schoolId');
    localStorage.removeItem('role');

    Cookies.remove('token'); // Eliminar la cookie
    router.push('/auth/login'); // Redirigir al usuario a la página de login
  };

  return (
    <AuthContext.Provider value={{ userId, schoolId, role, tempStudentId,login, logout, setTempStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};