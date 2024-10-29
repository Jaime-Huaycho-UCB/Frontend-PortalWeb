import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [permiso, setPermiso] = useState(null); 

  const iniciarSesion = (nuevoRol) => {
    console.log("permiso asignado:", nuevoRol);
    setPermiso(nuevoRol);
  };

  const cerrarSesion = () => {
    setPermiso(null);
  };

  return (
    <AuthContext.Provider value={{ permiso, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};
