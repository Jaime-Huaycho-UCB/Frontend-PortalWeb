import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import '../../estilos/paginas/ListaEgresados.css';

const egresadosData = [
  {
    id: 1,
    nombre: 'Sergio Mendoza',
    anoGraduacion: 2020,
    email: 'seegio.mendoza@example.com',
    imagen: 'https://sesameworkshop.org/wp-content/uploads/2023/03/presskit_ss_bio_elmo-560x420.png',
    bio: 'Sergio Mneodza es estudiante de la carrera de ingenieria en sistemassss rey ',
  },
  {
    id: 2,
    nombre: 'Jaime jimi',
    anoGraduacion: 2019,
    email: 'jaime.puta@example.com',
    imagen: 'https://sesameworkshop.org/wp-content/uploads/2023/03/presskit_ss_bio_elmo-560x420.png',
    bio: 'jaime puta es estudainte de la ccrera de satisfaccion al cliente fuerza en la boca ',
  },
];

const ListaEgresados = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEgresado, setSelectedEgresado] = useState(null);

  const handleShowModal = (egresado) => {
    setSelectedEgresado(egresado);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEgresado(null);
  };

  return (
    <Container className="mt-4">
      <h2 className="titulo">Galeria De Estudiantes</h2>
      <Row>
        {egresadosData.map((egresado) => (
          <Col key={egresado.id} sm={12} md={6} lg={4} className="mb-4">
            <Card className="card-egresado" onClick={() => handleShowModal(egresado)}>
              <Card.Img variant="top" src={egresado.imagen} className="foto-egresado" />
              <Card.Body>
                <Card.Title>{egresado.nombre}</Card.Title>
                <Card.Text>{egresado.anoGraduacion}</Card.Text>
                <Button variant="primary" onClick={() => handleShowModal(egresado)}>
                  Ver detalles
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEgresado?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Año de Graduación:</strong> {selectedEgresado?.anoGraduacion}</p>
          <p><strong>Email:</strong> {selectedEgresado?.email}</p>
          <p><strong>Biografía:</strong> {selectedEgresado?.bio}</p>
          <img src={selectedEgresado?.imagen} alt={selectedEgresado?.nombre} className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListaEgresados;
