'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [schoolId, setSchoolId] = useState(null);
  const [role, setRole] = useState('');

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
  };

  return (
    <AuthContext.Provider value={{ userId, schoolId, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};