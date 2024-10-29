// src/componentes/RutasProtegidas.js
import { useContext } from 'react';
import { AuthContext } from '../contextos/ContextoAutenticacion';
import { Navigate } from 'react-router-dom';

const RutasProtegidas = ({ children }) => {
  const { esAdministrador } = useContext(AuthContext);

  if (!esAdministrador) {
    return <Navigate to="/iniciar-sesion" />;
  }

  return children;
};

export default RutasProtegidas;
