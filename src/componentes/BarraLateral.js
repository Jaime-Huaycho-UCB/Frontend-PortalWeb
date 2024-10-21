import React from 'react';
import { Nav } from 'react-bootstrap';
import '../../estilos/paginas/BarraLateral.css';

const BarraLateral = () => {
  return (
    <Nav className="flex-column bg-light p-3" style={{ height: '100vh', width: '250px' }}>
      <Nav.Link href="/admin/panel">Panel Administrador</Nav.Link>
      <Nav.Link href="/admin/gestionar-docentes">Gestionar Docentes</Nav.Link>
      <Nav.Link href="/admin/gestionar-estudiantes">Gestionar Estudiantes</Nav.Link>
      <Nav.Link href="/admin/gestionar-noticias">Gestionar Noticias</Nav.Link>
      <Nav.Link href="/admin/gestionar-eventos">Gestionar Eventos</Nav.Link>
      <Nav.Link href="/admin/gestionar-pensum">Gestionar Pensum</Nav.Link>
    </Nav>
  );
};

export default BarraLateral;
