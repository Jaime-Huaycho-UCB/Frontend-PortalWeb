// App.js
import React, { useContext,useEffect,useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ListaDocentes from './paginas/Usuario/ListaDocentes/ListaDocentes';
import ListaEgresados from './paginas/Usuario/ListaEgresadosCompleto/ListaEgresados';
import ListaEventos from './paginas/Usuario/ListaEventosCompleto/ListaEventos';
import ListaNoticias from './paginas/Usuario/ListaNoticiasCompleto/ListaNoticias';
import Perfil from './paginas/Usuario/PerfilCompleto/Perfil';
import Encabezado from './componentes/EncabezadoCompleto/Encabezado';
import PieDePagina from './componentes/PiePagina/PieDePagina';
import IniciarSesion from './paginas/Autenticacion/IniciarSesion';
import GestionTesis from './paginas/Administrador/GestionarTesisCompleto/GestionTesis';
import GestionDocentes from './paginas/Administrador/GestionarDocentesCompleto/GestionDocentes';
import GestionEstudiantes from './paginas/Administrador/GestionarEstudiantesCompleto/GestionEstudiantes';
import GestionNoticias from './paginas/Administrador/GestionarNoticiasCompleto/GestionNoticias';
import GestionEventos from './paginas/Administrador/GestionarEventosCompleto/GestionEventos';
import { AuthContext, AuthProvider } from './contextos/ContextoAutenticacion';
import CrearUsuarioSuperior from './paginas/Administrador/CrearUsuarioCompleto/CrearUsuarioSuperior';
import Inicio from './componentes/inicioCompleto/Inicio';
import './estilos/layouts/global.css'

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
                    <Route path="/" element={<Inicio />} />


                    {/* Rutas protegidas */}
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
