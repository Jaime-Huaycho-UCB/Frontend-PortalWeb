import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import '../../estilos/paginas/PanelAdministrador.css';

const PanelAdministrador = () => {
  return (
    <Container className="panel-admin-container">
      <h2 className="text-center mt-4">Panel de Administración</h2>
      <Row className="mt-4">
        <Col md={4} className="mb-4">
          <Card className="admin-card">
            <Card.Body>
              <Card.Title>Gestión de Docentes</Card.Title>
              <Card.Text>
                Agrega, edita o elimina docentes de la base de datos.
              </Card.Text>
              <Button variant="primary" href="/gestion-docentes" className="btn-admin">Ir a Gestión</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="admin-card">
            <Card.Body>
              <Card.Title>Gestión de Estudiantes</Card.Title>
              <Card.Text>
                Administra la información de los estudiantes y sus registros.
              </Card.Text>
              <Button variant="primary" href="/gestion-estudiantes" className="btn-admin">Ir a Gestión</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="admin-card">
            <Card.Body>
              <Card.Title>Gestión de Noticias</Card.Title>
              <Card.Text>
                Publica, actualiza o elimina noticias relacionadas con la carrera.
              </Card.Text>
              <Button variant="primary" href="/gestion-noticias" className="btn-admin">Ir a Gestión</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={4} className="mb-4">
          <Card className="admin-card">
            <Card.Body>
              <Card.Title>Gestión de Eventos</Card.Title>
              <Card.Text>
                Organiza y administra eventos académicos.
              </Card.Text>
              <Button variant="primary" href="/gestion-eventos" className="btn-admin">Ir a Gestión</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="admin-card">
            <Card.Body>
              <Card.Title>Gestión de Pensum</Card.Title>
              <Card.Text>
                Gestiona el plan de estudios de la carrera.
              </Card.Text>
              <Button variant="primary" href="/gestion-pensum" className="btn-admin">Ir a Gestión</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PanelAdministrador;
