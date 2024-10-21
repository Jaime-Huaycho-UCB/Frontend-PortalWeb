import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import '../../estilos/paginas/ListaDocentes.css';

const docentesData = [
  {
    id: 1,
    nombre: 'Pachequito',
    departamento: 'Ingenieria',
    email: 'pachquitoperez@example.com',
    imagen: 'https://sesameworkshop.org/wp-content/uploads/2023/03/presskit_ss_bio_elmo-560x420.png',
    bio: 'pacheuqito es profesor de siostemas con 10 años de experiencia en la enseñanza.',
  },
  {
    id: 2,
    nombre: 'la chavez',
    departamento: 'matematica',
    email: 'la.chavez@example.com',
    imagen: 'https://sesameworkshop.org/wp-content/uploads/2023/03/presskit_ss_bio_elmo-560x420.png',
    bio: 'la chavez es doctora en matematica  y tiene más de 15 años en la investigación científica.',
  },
];

const ListaDocentes = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);

  const handleShowModal = (docente) => {
    setSelectedDocente(docente);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDocente(null);
  };

  return (
    <Container className="mt-4">
      <h2 className="titulo">Galeria De Docentes</h2>
      <Row>
        {docentesData.map((docente) => (
          <Col key={docente.id} sm={12} md={6} lg={4} className="mb-4">
            <Card className="card-docente" onClick={() => handleShowModal(docente)}>
              <Card.Img variant="top" src={docente.imagen} className="foto-docente" />
              <Card.Body>
                <Card.Title>{docente.nombre}</Card.Title>
                <Card.Text>{docente.departamento}</Card.Text>
                <Button variant="primary" onClick={() => handleShowModal(docente)}>
                  Ver detalles
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedDocente?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Departamento:</strong> {selectedDocente?.departamento}</p>
          <p><strong>Email:</strong> {selectedDocente?.email}</p>
          <p><strong>Biografía:</strong> {selectedDocente?.bio}</p>
          <img src={selectedDocente?.imagen} alt={selectedDocente?.nombre} className="img-fluid" />
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

export default ListaDocentes;
