import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    permiso: null,
    idUsuario: null,
    idDocente: null,
    token: null,
  });

  const [tema, setTema] = useState(localStorage.getItem('tema') || 'light'); // Estado para el tema

  const iniciarSesion = (nuevoPermiso, nuevoIdUsuario, nuevoIdDocente, nuevoToken) => {
    const newAuth = {
      permiso: nuevoPermiso,
      idUsuario: nuevoIdUsuario,
      idDocente: nuevoIdDocente,
      token: nuevoToken,
    };
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
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

  const toggleTema = () => {
    const nuevoTema = tema === 'light' ? 'dark' : 'light';
    setTema(nuevoTema);
    localStorage.setItem('tema', nuevoTema); // Persistencia del tema en el almacenamiento local
    document.documentElement.setAttribute('data-theme', nuevoTema);
  };

  useEffect(() => {
    // Aplica el tema al cargar la aplicación
    document.documentElement.setAttribute('data-theme', tema);

    // Limpia datos de autenticación al cargar por seguridad
    localStorage.removeItem('auth');
    console.log("Se ha limpiado cualquier información de autenticación previa.");
  }, [tema]);

  return (
    <AuthContext.Provider value={{ ...auth, iniciarSesion, cerrarSesion, tema, toggleTema }}>
      {children}
    </AuthContext.Provider>
  );
};
