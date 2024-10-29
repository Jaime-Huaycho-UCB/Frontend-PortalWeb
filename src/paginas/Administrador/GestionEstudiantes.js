import React, { useState } from 'react';
import { Button, Form, Modal, Card } from 'react-bootstrap';
import '../../estilos/AdministradorEstilos/GestionEstudiantes.css';

const GestionEstudiantes = () => {
  const [showModal, setShowModal] = useState(false);
  const [newEstudiante, setNewEstudiante] = useState({ nombre: '', carrera: '', email: '', fechaIngreso: '', foto: null });
  const [estudiantes, setEstudiantes] = useState([
    { id: 1, nombre: 'Carlos Martínez', carrera: 'Derecho', email: 'carlos.martinez@example.com', fechaIngreso: '2020' , foto: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/4ef8/live/970bbd30-c0fa-11ee-897d-3950f2e7afa7.jpg.webp' },
    { id: 2, nombre: 'Lucía González', carrera: 'Ciencias Políticas', email: 'lucia.gonzalez@example.com', fechaIngreso: '2021', foto: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/4ef8/live/970bbd30-c0fa-11ee-897d-3950f2e7afa7.jpg.webp' },
  ]);

  const handleAddEstudiante = () => {
    setEstudiantes([...estudiantes, { ...newEstudiante, id: estudiantes.length + 1 }]);
    setNewEstudiante({ nombre: '', carrera: '', email: '', fechaIngreso: '', foto: null });
    setShowModal(false);
  };

  const handleImageUpload = (e) => {
    setNewEstudiante({ ...newEstudiante, foto: URL.createObjectURL(e.target.files[0]) });
  };

  return (
    <div className="gestion-estudiantes-container">
      <div className="header">
        <h2>Gestión de Estudiantes</h2>
        <Button variant="primary" onClick={() => setShowModal(true)} className="add-estudiante-btn">Agregar Estudiante</Button>
      </div>

      <div className="estudiantes-grid">
        {estudiantes.map((estudiante) => (
          <Card key={estudiante.id} className="estudiante-card">
            {estudiante.foto && (
              <Card.Img variant="top" src={estudiante.foto} alt="Foto del estudiante" />
            )}
            <Card.Body>
              <Card.Title>{estudiante.nombre}</Card.Title>
              <Card.Text>
                Carrera: {estudiante.carrera}<br />
                Email: {estudiante.email}<br />
                Fecha de Ingreso: {estudiante.fechaIngreso}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Estudiante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre del estudiante"
                value={newEstudiante.nombre}
                onChange={(e) => setNewEstudiante({ ...newEstudiante, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCarrera" className="mt-3">
              <Form.Label>Carrera</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la carrera"
                value={newEstudiante.carrera}
                onChange={(e) => setNewEstudiante({ ...newEstudiante, carrera: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa el email"
                value={newEstudiante.email}
                onChange={(e) => setNewEstudiante({ ...newEstudiante, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFechaIngreso" className="mt-3">
              <Form.Label>Fecha de Ingreso</Form.Label>
              <Form.Control
                type="text"
                placeholder="Año de ingreso"
                value={newEstudiante.fechaIngreso}
                onChange={(e) => setNewEstudiante({ ...newEstudiante, fechaIngreso: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFoto" className="mt-3">
              <Form.Label>Foto del Estudiante</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {newEstudiante.foto && (
                <div className="preview-image mt-3">
                  <img src={newEstudiante.foto} alt="Previsualización de la foto" width="100%" />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleAddEstudiante}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionEstudiantes;
