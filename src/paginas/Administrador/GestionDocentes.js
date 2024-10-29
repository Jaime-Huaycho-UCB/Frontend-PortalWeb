import React, { useState } from 'react';
import { Button, Modal, Card, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import '../../estilos/AdministradorEstilos/GestionDocentes.css';

const GestionDocentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [show, setShow] = useState(false);
  const [nuevoDocente, setNuevoDocente] = useState({
    nombre: '',
    email: '',
    titulo: '',
    frase: '',
    foto: null,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const agregarDocente = async () => {
    const rutaFoto = nuevoDocente.foto ? `docentes/${nuevoDocente.foto.name}` : '';

    try {
      const response = await axios.post('http://localhost:8000/docente/agregar', {
        nombre: nuevoDocente.nombre,
        correo: nuevoDocente.email,
        titulo: nuevoDocente.titulo,
        frase: nuevoDocente.frase,
        ruta: rutaFoto,
      });

      setDocentes([...docentes, { ...response.data, foto: rutaFoto }]);
      setNuevoDocente({ nombre: '', email: '', titulo: '', frase: '', foto: null });
      handleClose();
    } catch (error) {
      console.error("Error al agregar docente:", error);
    }
  };

  const manejarCambioFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const rutaFoto = `docentes/${file.name}`;
      setNuevoDocente({ ...nuevoDocente, foto: rutaFoto });

      const reader = new FileReader();
      reader.onloadend = () => {
        const url = URL.createObjectURL(file);
        setNuevoDocente({ ...nuevoDocente, foto: url });
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
              <Card.Img variant="top" src={docente.foto} alt="Foto del Docente" className="docente-foto" />
              <Card.Body>
                <Card.Title>{docente.nombre}</Card.Title>
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={nuevoDocente.email}
                onChange={(e) => setNuevoDocente({ ...nuevoDocente, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={nuevoDocente.titulo}
                onChange={(e) => setNuevoDocente({ ...nuevoDocente, titulo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Frase</Form.Label>
              <Form.Control
                type="text"
                value={nuevoDocente.frase}
                onChange={(e) => setNuevoDocente({ ...nuevoDocente, frase: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Foto del Docente</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={manejarCambioFoto} />
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
