'use client'
import { createContext, useContext, useState } from 'react';

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  // Función para manejar el error y resetear el estado de error
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const resetError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, handleError, resetError }}>
      {children}
    </ErrorContext.Provider>
  );
};