import React, { useState } from 'react';
import { Button, Modal, Card, Row, Col, Form } from 'react-bootstrap';
import '../../estilos/AdministradorEstilos/GestionDocentes.css';

const GestionDocentes = () => {
  const [docentes, setDocentes] = useState([
    { id: 1, nombre: 'Juan Pérez', departamento: 'Matemáticas', email: 'juan.perez@example.com', foto:'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/4ef8/live/970bbd30-c0fa-11ee-897d-3950f2e7afa7.jpg.webp' },
    { id: 2, nombre: 'María Rodríguez', departamento: 'Física', email: 'maria.rodriguez@example.com', foto:'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/4ef8/live/970bbd30-c0fa-11ee-897d-3950f2e7afa7.jpg.webp' }
  ]);

  const [show, setShow] = useState(false);
  const [nuevoDocente, setNuevoDocente] = useState({
    nombre: '',
    departamento: '',
    email: '',
    foto: null
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const agregarDocente = () => {
    setDocentes([...docentes, { id: docentes.length + 1, ...nuevoDocente }]);
    setNuevoDocente({ nombre: '', departamento: '', email: '', foto: null });
    handleClose();
  };

  const manejarCambioFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoDocente({ ...nuevoDocente, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="gestion-docentes-container">
      <div className="header">
        <h2>Gestión de Docentes</h2>
        <Button className="add-docente-btn" onClick={handleShow}>
          Agregar Docente
        </Button>
      </div>

      <Row>
        {docentes.map((docente) => (
          <Col md={4} key={docente.id}>
            <Card className="docente-card mb-4">
              <Card.Img variant="top" src={docente.foto || '/ruta/a/foto-placeholder.jpg'} alt="Foto del Docente" className="docente-foto" />
              <Card.Body>
                <Card.Title>{docente.nombre}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{docente.departamento}</Card.Subtitle>
                <Card.Text>Email: {docente.email}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Agregar Docente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nuevoDocente.nombre}
                onChange={(e) => setNuevoDocente({ ...nuevoDocente, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Departamento</Form.Label>
              <Form.Control
                type="text"
                value={nuevoDocente.departamento}
                onChange={(e) => setNuevoDocente({ ...nuevoDocente, departamento: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={nuevoDocente.email}
                onChange={(e) => setNuevoDocente({ ...nuevoDocente, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Foto del Docente</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={manejarCambioFoto}
              />
              {nuevoDocente.foto && (
                <div className="vista-previa">
                  <img src={nuevoDocente.foto} alt="Vista previa" className="foto-previa" />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button className="add-docente-btn" onClick={agregarDocente}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionDocentes;
