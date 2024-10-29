import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import '../../estilos/AdministradorEstilos/GestionEventos.css';

const GestionEventos = () => {
  const [showModal, setShowModal] = useState(false);
  const [newEvento, setNewEvento] = useState({ nombre: '', fecha: '', ubicacion: '', descripcion: '', imagen: null });
  const [eventos, setEventos] = useState([
    { id: 1, nombre: 'Conferencia Internacional', fecha: '15 Nov 2024', ubicacion: 'Auditorio Central', descripcion: 'Un evento internacional sobre tecnología.', imagen: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/4ef8/live/970bbd30-c0fa-11ee-897d-3950f2e7afa7.jpg.webp' },
    { id: 2, nombre: 'Taller de Innovación', fecha: '20 Dic 2024', ubicacion: 'Sala 101', descripcion: 'Taller práctico sobre innovación en la industria.', imagen: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/4ef8/live/970bbd30-c0fa-11ee-897d-3950f2e7afa7.jpg.webp' },
  ]);

  const manejarCambioFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvento({ ...newEvento, imagen: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEvento = () => {
    setEventos([...eventos, { ...newEvento, id: eventos.length + 1 }]);
    setNewEvento({ nombre: '', fecha: '', ubicacion: '', descripcion: '', imagen: null });
    setShowModal(false);
  };

  return (
    <div className="gestion-eventos-container">
      <div className="header">
        <h2>Gestión de Eventos</h2>
        <Button variant="primary" onClick={() => setShowModal(true)} className="add-evento-btn">Agregar Evento</Button>
      </div>

      {/* Línea de tiempo de eventos */}
      <div className="timeline">
        {eventos.map((evento, index) => (
          <div key={evento.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="timeline-img">
              <img src={evento.imagen || '/ruta/a/foto-placeholder.jpg'} alt={evento.nombre} />
            </div>
            <div className="timeline-content">
              <h3>{evento.nombre}</h3>
              <p><strong>Fecha:</strong> {evento.fecha}</p>
              <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
              <p>{evento.descripcion}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para agregar eventos */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre del Evento</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre del evento"
                value={newEvento.nombre}
                onChange={(e) => setNewEvento({ ...newEvento, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFecha" className="mt-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={newEvento.fecha}
                onChange={(e) => setNewEvento({ ...newEvento, fecha: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formUbicacion" className="mt-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la ubicación"
                value={newEvento.ubicacion}
                onChange={(e) => setNewEvento({ ...newEvento, ubicacion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion" className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe el evento"
                value={newEvento.descripcion}
                onChange={(e) => setNewEvento({ ...newEvento, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formImagen" className="mt-3">
              <Form.Label>Imagen del Evento</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={manejarCambioFoto}
              />
              {newEvento.imagen && (
                <div className="vista-previa mt-3">
                  <img src={newEvento.imagen} alt="Vista previa" className="foto-previa" />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleAddEvento}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionEventos;
