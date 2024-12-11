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
import EnviarSolicitud from './componentes/EnviarSolicitudCompleto/EnviarSolicitud';
import Mensajes from './componentes/MensajesCompleto/Mensajes';
import Publicaciones from './paginas/Administrador/PublicacionesCompleto/Publicaciones';
import IconosFlotantes from './componentes/IconosFlotantesCompleto/IconosFlotantes';
import Chasqui from './paginas/Usuario/ChaquiPostasCompleto/Chasqui';
import Tesis from './paginas/Usuario/TesisCompleto/tesis';
import Sociedad from './paginas/Usuario/SociedadCompleto/Sociedad';
import RecuperarContrasena from './paginas/Autenticacion/Recuperar';
import Validar from './paginas/Autenticacion/Vlidar';
import CambiarContrasena from './paginas/Autenticacion/cambiarContrasena ';
const RutaProtegida = ({ children, rolesPermitidos }) => {
  const { permiso } = useContext(AuthContext);
 

  if (permiso === null) return <Navigate to="/iniciar-sesion" replace />;
  if (!rolesPermitidos.includes(permiso)) return <Navigate to="/" replace />; 
  return children;
};

function App() {
  const [mostrarIconos, setMostrarIconos] = useState(true);
  
  useEffect(() => {
    const observarScroll = () => {
      const welcomeSection = document.getElementById("welcome-section1");
      if (welcomeSection) {
        const rect = welcomeSection.getBoundingClientRect();
        setMostrarIconos(rect.bottom <= 0); 
      }
    };

    window.addEventListener("scroll", observarScroll);

    return () => {
      window.removeEventListener("scroll", observarScroll);
    };
  }, []);


  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta de inicio con wrapper */}
          <Route
            path="/"
            element={
              <div className="wrapper">
                <Encabezado />
                <div className="main-content">
                  <Inicio />
                </div>
                {mostrarIconos && <EnviarSolicitud />}
                {mostrarIconos && <IconosFlotantes />}
                <PieDePagina />
              </div>
            }
          />
          
          {/* Ruta de inicio de sesión SIN wrapper */}
          <Route path="/iniciar-sesion" element={<IniciarSesion />} />
          <Route path='/recuperar' element={<RecuperarContrasena />}/>
          <Route path='/validar' element={<Validar />}/>
          <Route path='/cambiar' element={<CambiarContrasena />}/>
          {/* Rutas generales SIN wrapper */}
          <Route
            path="*"
            element={
              <div>
                <Encabezado />
                <div className="main-content">
                  <Routes>
                    <Route path="/docentes" element={<ListaDocentes />} />
                    <Route path="/egresados" element={<ListaEgresados />} />
                    <Route path="/eventos" element={<ListaEventos />} />
                    <Route path="/noticias" element={<ListaNoticias />} />
                    <Route path="/chasqui" element={<Chasqui />} />
                    <Route path="/Tesis" element={<Tesis />} />
                    <Route path="/Sociedad" element={<Sociedad />} />

                    {/* Rutas protegidas */}
                    <Route path="/admin/gestion-docentes" element={
                      <RutaProtegida rolesPermitidos={[1]}>
                        <GestionDocentes />
                      </RutaProtegida>
                    } />
                    <Route path="/admin/publicacion" element={
                      <RutaProtegida rolesPermitidos={[1, 0]}>
                        <Publicaciones />
                      </RutaProtegida>
                    } />
                    <Route path="/admin/mensajes" element={
                      <RutaProtegida rolesPermitidos={[1]}>
                        <Mensajes />
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
