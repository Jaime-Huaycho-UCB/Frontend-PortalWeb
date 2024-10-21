import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../estilos/componentesEstilos/Encabezado.css'; 


const Encabezado = () => {
  return (
    <Navbar bg="light" expand="lg" className="encabezado">
      <Container>
        <Navbar.Brand href="/" className="titulo">Mi Portal</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/docentes">Docentes</Nav.Link>
            <Nav.Link as={Link} to="/egresados">Estudiantes</Nav.Link>
            <Nav.Link as={Link} to="/eventos">Eventos</Nav.Link>
            <Nav.Link as={Link} to="/noticias">Noticias</Nav.Link>
            <Nav.Link as={Link} to="/carrera">Carrera</Nav.Link>
            <Nav.Link as={Link} to="/autoridades">Autoridades</Nav.Link>
            <Nav.Link as={Link} to="/perfil">Perfil</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Encabezado;
