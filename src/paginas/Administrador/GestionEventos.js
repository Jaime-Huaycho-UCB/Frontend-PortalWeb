import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { agregarEvento, obtenerEventos, manejarCambioFoto } from '../../librerias/PeticionesApi';
import '../../estilos/AdministradorEstilos/GestionEventos.css';

const GestionEventos = () => {
  const [showModal, setShowModal] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '',
    descripcion: '',
    director: '',
    fecha: '',
    lugar: '',
    fotoBase64: '',
  });

  const setFotoBase64 = (base64) => {
    setNuevoEvento((prevEvento) => ({ ...prevEvento, fotoBase64: base64 }));
  };

  useEffect(() => {
   
    obtenerEventos()
      .then((data) => {
        if (data.salida) {
          setEventos(data.eventos);
        }
      })
      .catch(console.error);
  }, []);

  const agregarNuevoEvento = async () => {
    const idUsuario='';
    const token='';
    const eventoData = {
      nombre: nuevoEvento.nombre,
      descripcion: nuevoEvento.descripcion,
      director: nuevoEvento.director,
      fecha: nuevoEvento.fecha,
      lugar: nuevoEvento.lugar,
      fotoBase64: nuevoEvento.fotoBase64,
    };
    
    try {
      await agregarEvento(eventoData,idUsuario,token); 
      const data = await obtenerEventos();
      setEventos(data.eventos); 
  
      setShowModal(false);
      setNuevoEvento({ nombre: '', descripcion: '', director: '', fecha: '', lugar: '', fotoBase64: '' });
    } catch (error) {
      console.error(error);
    }
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
              <img src={evento.fotoBase64} alt={evento.nombre} />
            </div>
            <div className="timeline-content">
              <h3>{evento.nombre}</h3>
              <p><strong>Fecha:</strong> {evento.fecha}</p>
              <p><strong>Ubicación:</strong> {evento.lugar}</p>
              <p>{evento.descripcion}</p>
              <p><strong>director</strong>{evento.director}</p>
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
                value={nuevoEvento.nombre}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="forDirector">
              <Form.Label>Director del evento</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre del Director del evento"
                value={nuevoEvento.director}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, director: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formFecha" className="mt-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={nuevoEvento.fecha}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formUbicacion" className="mt-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el lugar"
                value={nuevoEvento.lugar}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, lugar: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion" className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe el evento"
                value={nuevoEvento.descripcion}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Foto del Evento</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => manejarCambioFoto(e, setFotoBase64)} />
              {nuevoEvento.fotoBase64 && (
                <div className="vista-previa">
                  <img src={`data:image/jpeg;base64,${nuevoEvento.fotoBase64}`} alt="Vista previa" className="foto-previa" />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={agregarNuevoEvento}>Agregar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionEventos;
