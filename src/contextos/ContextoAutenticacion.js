import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    permiso: null,
    idUsuario: null,
    idDocente: null,
    token: null,
  });

  const [tema, setTema] = useState(localStorage.getItem('tema') || 'light');

  const iniciarSesion = (nuevoPermiso, nuevoIdUsuario, nuevoIdDocente, nuevoToken, navigate) => {
    const newAuth = {
      permiso: nuevoPermiso,
      idUsuario: nuevoIdUsuario,
      idDocente: nuevoIdDocente,
      token: nuevoToken,
    };
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));

    if (navigate) {
      navigate('/'); // Redirige a la página principal
    }
    console.log("Iniciando sesión con los siguientes datos:");
    console.log("Permiso:", nuevoPermiso);
    console.log("idUsuario:", nuevoIdUsuario);
    console.log("idDocente:", nuevoIdDocente);
    console.log("Token:", nuevoToken);
  };

  const cerrarSesion = (navigate) => {
    setAuth({
      permiso: null,
      idUsuario: null,
      idDocente: null,
      token: null,
    });
    localStorage.clear();

  
  };

  const toggleTema = () => {
    const nuevoTema = tema === 'light' ? 'dark' : 'light';
    setTema(nuevoTema);
    localStorage.setItem('tema', nuevoTema);
    document.documentElement.setAttribute('data-theme', nuevoTema);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.removeItem('auth'); // Limpieza inicial de datos
  }, [tema]);

  return (
    <AuthContext.Provider value={{ ...auth, iniciarSesion, cerrarSesion, tema, toggleTema }}>
      {children}
    </AuthContext.Provider>
  );
};
