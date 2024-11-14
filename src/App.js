// App.js
import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ListaDocentes from './paginas/Usuario/ListaDocentes';
import ListaEgresados from './paginas/Usuario/ListaEgresados';
import ListaEventos from './paginas/Usuario/ListaEventos';
import ListaNoticias from './paginas/Usuario/ListaNoticias';
import PaginaCarrera from './paginas/Usuario/PaginaCarrera';
import PaginaAutoridades from './paginas/Usuario/PaginaAutoridades';
import Perfil from './paginas/Usuario/Perfil';
import Encabezado from './componentes/Encabezado';
import PieDePagina from './componentes/PieDePagina';
import BarraDeBusqueda from './componentes/BarraDeBusqueda';
import IniciarSesion from './paginas/Autenticacion/IniciarSesion';
import Registro from './paginas/Autenticacion/Registro';
import PanelAdministrador from './paginas/Administrador/PanelAdministrador';
import GestionTesis from './paginas/Administrador/GestionTesis';

import GestionDocentes from './paginas/Administrador/GestionDocentes';
import GestionEstudiantes from './paginas/Administrador/GestionEstudiantes';
import GestionNoticias from './paginas/Administrador/GestionNoticias';
import GestionEventos from './paginas/Administrador/GestionEventos';
import { AuthContext, AuthProvider } from './contextos/ContextoAutenticacion';
import CrearUsuarioSuperior from './paginas/Administrador/CrearUsuarioSuperior';
import './estilos/layouts/global.css';
import Inicio from './componentes/Inicio';


const RutaProtegida = ({ children, rolesPermitidos }) => {
  const { permiso } = useContext(AuthContext);

  if (permiso === null) return <Navigate to="/iniciar-sesion" replace />;
  if (!rolesPermitidos.includes(permiso)) return <Navigate to="/" replace />; 
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas de autenticación SIN encabezado ni pie de página */}
          <Route path="/iniciar-sesion" element={<IniciarSesion />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas generales del portal */}
          <Route
            path="*"
            element={
              <div className="wrapper">
                <Encabezado />
                <div className="main-content">
                  <Routes>
                    <Route path="/docentes" element={<ListaDocentes />} />
                    <Route path="/egresados" element={<ListaEgresados />} />
                    <Route path="/eventos" element={<ListaEventos />} />
                    <Route path="/noticias" element={<ListaNoticias />} />
                    <Route path="/carrera" element={<PaginaCarrera />} />
                    <Route path="/autoridades" element={<PaginaAutoridades />} />
                    <Route path="/" element={<Inicio />} />


                    {/* Rutas protegidas */}
                    <Route path="/admin" element={
                      <RutaProtegida rolesPermitidos={[1, 0]}>
                        <PanelAdministrador />
                      </RutaProtegida>
                    } />
                    <Route path="/admin/gestion-docentes" element={
                      <RutaProtegida rolesPermitidos={[1]}>
                        <GestionDocentes />
                      </RutaProtegida>
                    } />
                    <Route path="/admin/gestion-estudiantes" element={
                      <RutaProtegida rolesPermitidos={[1, 0]}>
                        <GestionEstudiantes />
                      </RutaProtegida>
                    } />
                    <Route path="/admin/gestion-noticias" element={
                      <RutaProtegida rolesPermitidos={[1, 0]}>
                        <GestionNoticias />
                      </RutaProtegida>
                    } />
                    <Route path="/admin/gestion-eventos" element={
                      <RutaProtegida rolesPermitidos={[1, 0]}>
                        <GestionEventos />
                      </RutaProtegida>
                    } />
                    <Route path="/admin/crear-usuario" element={
                      <RutaProtegida rolesPermitidos={[1]}>
                        <CrearUsuarioSuperior />
                      </RutaProtegida>
                    } />
                    <Route path="/admin/perfil" element={
                      <RutaProtegida rolesPermitidos={[1, 0]}>
                        <Perfil />
                      </RutaProtegida>
                    } />
                     <Route path="/admin/gestion-tesis" element={
                      <RutaProtegida rolesPermitidos={[1, 0]}>
                        <GestionTesis />
                      </RutaProtegida>
                    } />
                  </Routes>
                </div>
                <PieDePagina />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
