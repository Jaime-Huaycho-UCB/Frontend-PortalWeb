import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { obtenerDocentes } from '../../librerias/PeticionesApi';
import '../../estilos/paginas/ListaDocentes.css';

const ListaDocentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);

  useEffect(() => {
    const idUsuario = '';  
    const token = '';      

    const cargarDocentes = async () => {
      try {
        const data = await obtenerDocentes(idUsuario, token); 
        if (data.salida) {
          setDocentes(data.docentes);
        }
      } catch (error) {
        console.error("Error al cargar docentes:", error);
      }
    };

    cargarDocentes();
  }, []);

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
      <h2 className="titulo">Galería de Docentes</h2>
      <Row>
        {docentes.map((docente) => (
          <Col key={docente.id} sm={12} md={6} lg={4} className="mb-4">
            <Card className="card-docente">
              <Card.Img
                variant="top"
                src={docente.foto || '/ruta/a/imagen-placeholder.jpg'}
                className="foto-docente"
                onClick={() => handleShowModal(docente)}
              />
              <Card.Body>
                <Card.Title>{docente.nombre}</Card.Title>
                <Card.Text>{docente.email}</Card.Text>
                <Card.Text>{docente.titulo}</Card.Text>
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
          <p><strong>Frase:</strong> {selectedDocente?.frase}</p>
          <img src={selectedDocente?.foto} alt={selectedDocente?.nombre} className="img-fluid" />
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
