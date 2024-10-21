import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../estilos/componentesEstilos/PieDePagina.css'; // Asegurarse de que la ruta sea correcta

const PieDePagina = () => {
  return (
    <footer className="pie-de-pagina bg-light text-center text-lg-start">
      <Container className="p-4">
        <Row>
          <Col lg="6" md="12" className="mb-4 mb-md-0">
            <h5 className="text-uppercase titulo-footer">Footer Content</h5>
            <p className="texto-footer">
              Aquí puedes usar filas y columnas para organizar tu contenido.
            </p>
          </Col>
          <Col lg="3" md="6" className="mb-4 mb-md-0">
            <h5 className="text-uppercase titulo-footer">Enlaces</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="enlace-footer">Inicio</a>
              </li>
              <li>
                <a href="/contacto" className="enlace-footer">Contacto</a>
              </li>
            </ul>
          </Col>
          <Col lg="3" md="6" className="mb-4 mb-md-0">
            <h5 className="text-uppercase titulo-footer">Redes Sociales</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#!" className="enlace-footer">Facebook</a>
              </li>
              <li>
                <a href="#!" className="enlace-footer">Twitter</a>
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
