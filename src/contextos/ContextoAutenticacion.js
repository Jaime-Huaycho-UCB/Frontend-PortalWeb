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
    console.log("Cerrando sesión...");
    setAuth({ permiso: null, idUsuario: null, idDocente: null, token: null });
    localStorage.removeItem('auth');
  };

  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem('auth'));
    if (savedAuth) {
      setAuth(savedAuth);
      console.log("Valores de autenticación cargados desde localStorage:");
      console.log(savedAuth);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};
