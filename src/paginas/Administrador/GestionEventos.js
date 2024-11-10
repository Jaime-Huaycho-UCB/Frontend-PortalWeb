import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { agregarEvento, obtenerEventos, actualizarEvento, eliminarEvento, manejarCambioFoto } from '../../librerias/PeticionesApi';
import { AuthContext } from '../../contextos/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';

const GestionEventos = () => {
  const { idUsuario, token, cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
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

  const cargarEventos = useCallback(async () => {
    try {
      const data = await obtenerEventos();
      if (data.salida) {
        setEventos(data.eventos);
      } else if (data.mensaje === 'TKIN') {
        cerrarSesion();
        navigate('/iniciar-sesion');
      }
    } catch (error) {
      console.error(error);
    }
  }, [cerrarSesion, navigate]);

  useEffect(() => {
    cargarEventos();
  }, [cargarEventos]);

  const agregarNuevoEvento = useCallback(async () => {
    try {
      const response = await agregarEvento(nuevoEvento, idUsuario, token);
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
          cerrarSesion();
          navigate('/iniciar-sesion');
        } else {
          console.error(response.mensaje);
        }
        return;
      }
      cargarEventos();
      setShowModal(false);
      setNuevoEvento({ nombre: '', descripcion: '', director: '', fecha: '', lugar: '', fotoBase64: '' });
    } catch (error) {
      console.error(error);
    }
  }, [cargarEventos, cerrarSesion, navigate, nuevoEvento, idUsuario, token]);

  const iniciarEdicion = (evento) => {
    setIsUpdating(true);
    setEventoSeleccionado(evento.id);
    setNuevoEvento({
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      director: evento.director,
      fecha: evento.fecha,
      lugar: evento.lugar,
      fotoBase64: '',
    });
    setShowModal(true);
  };

  const actualizarEventoExistente = useCallback(async () => {
    try {
      const response = await actualizarEvento(eventoSeleccionado, nuevoEvento, idUsuario, token);
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
          cerrarSesion();
          navigate('/iniciar-sesion');
        } else {
          console.error(response.mensaje);
        }
        return;
      }
      cargarEventos();
      setShowModal(false);
      setIsUpdating(false);
      setNuevoEvento({ nombre: '', descripcion: '', director: '', fecha: '', lugar: '', fotoBase64: '' });
    } catch (error) {
      console.error(error);
    }
  }, [cargarEventos, cerrarSesion, navigate, eventoSeleccionado, nuevoEvento, idUsuario, token]);

  const confirmarEliminacion = useCallback(async (id) => {
    try {
      const response = await eliminarEvento(id, idUsuario, token);
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
          cerrarSesion();
          navigate('/iniciar-sesion');
        } else {
          console.error(response.mensaje);
        }
        return;
      }
      cargarEventos();
    } catch (error) {
      console.error(error);
    }
  }, [cargarEventos, cerrarSesion, navigate, idUsuario, token]);

  return (
    <div className="gestion-eventos-container">
      <div className="header">
        <h2>Gestión de Eventos</h2>
        <Button variant="primary" onClick={() => setShowModal(true)} className="add-evento-btn">Agregar Evento</Button>
      </div>

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
              <p><strong>Director:</strong> {evento.director}</p>
              <Button variant="warning" onClick={() => iniciarEdicion(evento)}>Actualizar</Button>
              <Button variant="danger" onClick={() => confirmarEliminacion(evento.id)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => { setShowModal(false); setIsUpdating(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdating ? 'Actualizar Evento' : 'Agregar Nuevo Evento'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre del Evento</Form.Label>
              <Form.Control
                type="text"
                value={nuevoEvento.nombre}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDirector" className="mt-3">
              <Form.Label>Director del Evento</Form.Label>
              <Form.Control
                type="text"
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
                value={nuevoEvento.lugar}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, lugar: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion" className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={nuevoEvento.descripcion}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFoto" className="mt-3">
              <Form.Label>Foto del Evento</Form.Label>
              <Form.Control type="file" onChange={(e) => manejarCambioFoto(e, setFotoBase64)} />
              {nuevoEvento.fotoBase64 && <img src={`data:image/jpeg;base64,${nuevoEvento.fotoBase64}`} alt="Vista previa" className="foto-previa" />}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowModal(false); setIsUpdating(false); }}>Cerrar</Button>
          <Button variant="primary" onClick={isUpdating ? actualizarEventoExistente : agregarNuevoEvento}>
            {isUpdating ? 'Actualizar' : 'Agregar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionEventos;
