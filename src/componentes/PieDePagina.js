import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const PieDePagina = () => {
  return (
    <footer className="bg-light text-center text-lg-start">
      <Container className="p-4">
        <Row>
          <Col lg="6" md="12" className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Footer Content</h5>
            <p>
              Aquí puedes usar filas y columnas para organizar tu contenido.
            </p>
          </Col>
          <Col lg="3" md="6" className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Enlaces</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-dark">Inicio</a>
              </li>
              <li>
                <a href="/contacto" className="text-dark">Contacto</a>
              </li>
            </ul>
          </Col>
          <Col lg="3" md="6" className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Acceso Administrador</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/iniciar-sesion" className="text-dark">Iniciar Sesión</a>
              </li>
              <li>
                <a href="/registro" className="text-dark">Registrarse</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="text-center p-3 bg-dark text-white">
        © 2024 Derechos Reservados.
      </div>
    </footer>
  );
};

export default PieDePagina;
