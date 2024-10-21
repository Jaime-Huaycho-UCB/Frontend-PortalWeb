import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const PanelUsuario = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Perfil del Usuario</Card.Title>
              <Card.Text>Gestiona tus datos y preferencias.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Lista de Docentes</Card.Title>
              <Card.Text>Consulta el listado completo de docentes.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Lista de Eventos</Card.Title>
              <Card.Text>Descubre los próximos eventos.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PanelUsuario;
