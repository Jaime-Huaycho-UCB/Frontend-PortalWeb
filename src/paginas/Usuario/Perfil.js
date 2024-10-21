import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Perfil = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Juan Pérez</Card.Title>
              <Card.Text>Email: juan.perez@example.com</Card.Text>
              <Card.Text>Departamento: Matemáticas</Card.Text>
              <Card.Text>Rol: Docente</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <h4>Información Adicional</h4>
          <p>Esta sección puede mostrar información adicional como actividades recientes, publicaciones, etc.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Perfil;
