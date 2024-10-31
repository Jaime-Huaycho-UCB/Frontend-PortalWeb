// Inicio.js
import React from 'react';
import { Container, Row, Col, Card, Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../estilos/paginas/Inicio.css';

const Inicio = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Bienvenido al Portal Universitario</h2>
      <p className="text-center mb-5">
        Explora nuestras noticias, eventos y recursos educativos para mantenerte informado sobre nuestra comunidad académica.
      </p>

      {/* Sección de Noticias Destacadas */}
      <h4 className="mb-3">Noticias Destacadas</h4>
      <Carousel className="mb-5">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x300?text=Noticia+1"
            alt="Primera Noticia"
          />
          <Carousel.Caption>
            <h5>Nuevo programa de investigación lanzado</h5>
            <p>Descubre los detalles sobre nuestro nuevo programa de investigación en ciencias aplicadas.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x300?text=Noticia+2"
            alt="Segunda Noticia"
          />
          <Carousel.Caption>
            <h5>Convocatoria abierta para becas 2024</h5>
            <p>Aprovecha las oportunidades de estudio y desarrollo profesional en nuestra universidad.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Próximos Eventos */}
      <h4 className="mb-3">Próximos Eventos</h4>
      <Row className="mb-5">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Conferencia de Ciencia y Tecnología</Card.Title>
              <Card.Text>Fecha: 12 de diciembre</Card.Text>
              <Card.Text>Ubicación: Auditorio principal</Card.Text>
              <Button variant="primary" as={Link} to="/eventos">
                Ver Más
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Expo Académica</Card.Title>
              <Card.Text>Fecha: 20 de enero</Card.Text>
              <Card.Text>Ubicación: Salón de exposiciones</Card.Text>
              <Button variant="primary" as={Link} to="/eventos">
                Ver Más
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sección de Enlaces Rápidos */}
      <h4 className="mb-3">Enlaces Rápidos</h4>
      <Row className="text-center mb-5">
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Docentes</Card.Title>
              <Card.Text>Conoce a nuestros docentes y sus especialidades</Card.Text>
              <Button variant="outline-primary" as={Link} to="/docentes">Explorar</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Egresados</Card.Title>
              <Card.Text>Descubre las experiencias de nuestros egresados</Card.Text>
              <Button variant="outline-primary" as={Link} to="/egresados">Explorar</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Noticias</Card.Title>
              <Card.Text>Mantente al día con las últimas noticias</Card.Text>
              <Button variant="outline-primary" as={Link} to="/noticias">Explorar</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Historia de la Carrera */}
      <div className="mt-5">
        <h4 className="mb-3">Historia de Nuestra Carrera</h4>
        <p>
          Nuestra universidad ha formado a miles de profesionales a lo largo de los años, brindando una educación de calidad con enfoques en
          innovación y compromiso social. Nos enorgullece ver a nuestros egresados contribuir al desarrollo de la sociedad en diversas áreas.
        </p>
      </div>
    </Container>
  );
};

export default Inicio;
