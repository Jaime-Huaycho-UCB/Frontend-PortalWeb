import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import '../../estilos/paginas/PaginaAutoridades.css';

const PaginaAutoridades = () => {
  return (
    <Container className="mt-4">
      <h2>Autoridades de la Facultad</h2>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Dr. Luis Gómez</Card.Title>
              <Card.Text>Decano de la Facultad</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Dra. Ana López</Card.Title>
              <Card.Text>Jefa de Departamento</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaginaAutoridades;
