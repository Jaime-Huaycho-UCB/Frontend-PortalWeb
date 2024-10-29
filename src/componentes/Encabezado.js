// Encabezado.js
import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contextos/ContextoAutenticacion';
import '../estilos/componentesEstilos/Encabezado.css';

const Encabezado = () => {
  const { permiso } = useContext(AuthContext); 

  return (
    <Navbar bg="light" expand="lg" className="encabezado">
      <Container>
        <Navbar.Brand as={Link} to="/">Mi Portal</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {permiso === 1 ? (
              <>
                <Nav.Link as={Link} to="/admin/gestion-docentes">Gestión Docentes</Nav.Link>
                <Nav.Link as={Link} to="/admin/gestion-estudiantes">Gestión Estudiantes</Nav.Link>
                <Nav.Link as={Link} to="/admin/gestion-noticias">Gestión Noticias</Nav.Link>
                <Nav.Link as={Link} to="/admin/gestion-eventos">Gestión Eventos</Nav.Link>
                <Nav.Link as={Link} to="/admin/crear-usuario">Crear Usuario Superior</Nav.Link>
              </>
            ) : permiso === 0 ? (
              <>
                <Nav.Link as={Link} to="/admin/gestion-estudiantes">Gestión Estudiantes</Nav.Link>
                <Nav.Link as={Link} to="/admin/gestion-noticias">Gestión Noticias</Nav.Link>
                <Nav.Link as={Link} to="/admin/gestion-eventos">Gestión Eventos</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/docentes">Docentes</Nav.Link>
                <Nav.Link as={Link} to="/egresados">Egresados</Nav.Link>
                <Nav.Link as={Link} to="/eventos">Eventos</Nav.Link>
                <Nav.Link as={Link} to="/noticias">Noticias</Nav.Link>
                <Nav.Link as={Link} to="/carrera">Carrera</Nav.Link>
                <Nav.Link as={Link} to="/autoridades">Autoridades</Nav.Link>
                <Nav.Link as={Link} to="/perfil">Perfil</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Encabezado;
