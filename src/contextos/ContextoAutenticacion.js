import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [permiso, setPermiso] = useState(null);
  const [idUsuario , setIdUsuario]=useState(null);
  const [idDocente , setIdDocente]=useState(null);
  const [token , setToken]=useState(null);

  const iniciarSesion = (nuevoRol,nuevoIdUsuario,nuevuoIdDocente,nuevoToken) => {
    console.log("permiso asignado:", nuevoRol);
    console.log("idUsuario:", nuevoIdUsuario);
    console.log("idDocente:", nuevuoIdDocente);
    console.log("token :", nuevoToken);
    setPermiso(nuevoRol);
    setIdUsuario(nuevoIdUsuario);
    setIdDocente(nuevuoIdDocente);
    setToken(nuevoToken)
  };

  const cerrarSesion = () => {
    setPermiso(null);
    setIdUsuario(null);
    setIdDocente(null);
    setToken(null)
  };

  return (
    <AuthContext.Provider value={{ permiso,idUsuario,idDocente,token, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};
