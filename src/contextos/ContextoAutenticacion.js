// ContextoAutenticacion.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    permiso: null,
    idUsuario: null,
    idDocente: null,
    token: null,
  });

  const iniciarSesion = (nuevoPermiso, nuevoIdUsuario, nuevoIdDocente, nuevoToken) => {
    const newAuth = {
      permiso: nuevoPermiso,
      idUsuario: nuevoIdUsuario,
      idDocente: nuevoIdDocente,
      token: nuevoToken,
    };
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));

    // Agregar console.log para ver los valores cuando se inicie sesión
    console.log("Iniciando sesión con los siguientes datos:");
    console.log("Permiso:", nuevoPermiso);
    console.log("idUsuario:", nuevoIdUsuario);
    console.log("idDocente:", nuevoIdDocente);
    console.log("Token:", nuevoToken);
  };

  const cerrarSesion = () => {
    setAuth({
      permiso: null,
      idUsuario: null,
      idDocente: null,
      token: null,
    });
    localStorage.clear();
  };

  useEffect(() => {
    // Limpia cualquier dato previo de localStorage al cargar la aplicación
    localStorage.removeItem('auth');
    console.log("Se ha limpiado cualquier información de autenticación previa.");
  }, []);
  
  

  return (
    <AuthContext.Provider value={{ ...auth, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};
