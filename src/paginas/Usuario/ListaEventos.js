import React, { useState } from 'react';
import { Container, Modal, Button } from 'react-bootstrap';
import '../../estilos/paginas/ListaEventos.css';

const eventos = [
  {
    id: 1,
    nombre: 'Como canar ',
    fecha: '15 Nov 2024',
    ubicacion: 'Auditorio 4',
    descripcion: 'Conferencia sobre como ser alcolico anonimo ',
    imagen: 'https://sesameworkshop.org/wp-content/uploads/2023/03/presskit_ss_bio_elmo-560x420.png',
  },
  {
    id: 2,
    nombre: 'Como ser estriper',
    fecha: '20 Nov 2024',
    ubicacion: 'Aula F11',
    descripcion: 'Taller de como bailar bien riquitp simpre ',
    imagen: 'https://sesameworkshop.org/wp-content/uploads/2023/03/presskit_ss_bio_elmo-560x420.png',
  },
];

const ListaEventos = () => {
  const [show, setShow] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (evento) => {
    setEventoSeleccionado(evento);
    setShow(true);
  };

  return (
    <Container className="mt-4">
      <h2>Próximos Eventos</h2>
      <div className="timeline">
        {eventos.map((evento, index) => (
          <div
            key={evento.id}
            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            onClick={() => handleShow(evento)}
          >
            <div className="timeline-img">
              <img src={evento.imagen} alt={evento.nombre} />
            </div>
            <div className="timeline-content">
              <h3>{evento.nombre}</h3>
              <h4>{evento.fecha}</h4>
              <p>{evento.ubicacion}</p>
            </div>
          </div>
        ))}
      </div>

      {eventoSeleccionado && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{eventoSeleccionado.nombre}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={eventoSeleccionado.imagen} alt={eventoSeleccionado.nombre} className="modal-img" />
            <p><strong>Fecha:</strong> {eventoSeleccionado.fecha}</p>
            <p><strong>Ubicación:</strong> {eventoSeleccionado.ubicacion}</p>
            <p>{eventoSeleccionado.descripcion}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ListaEventos;
