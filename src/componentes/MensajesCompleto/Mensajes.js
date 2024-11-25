import React, { useState, useEffect, useContext } from 'react';
import { obtenerMensajes, eliminarMensaje } from '../../librerias/PeticionesApi.js';
import { Container, Row, Col, ListGroup, Button, Modal } from 'react-bootstrap';
import { AuthContext } from '../../contextos/ContextoAutenticacion.js';
import './mesaje.css';

const Mensajes = () => {
  const { idUsuario, token } = useContext(AuthContext);
  const [mensajes, setMensajes] = useState([]);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const fetchMensajes = async () => {
    try {
      const data = await obtenerMensajes(idUsuario, token);
      setMensajes(data.solicitudes || []);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  const handleEliminarMensaje = async (idSolicitud) => {
    try {
      await eliminarMensaje(idSolicitud, idUsuario, token);
      setMensajes((prevMensajes) =>
        prevMensajes.filter((mensaje) => mensaje.id !== idSolicitud)
      );
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
    }
  };

  const handleVerMensaje = (mensaje) => {
    setMensajeSeleccionado(mensaje);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMensajeSeleccionado(null);
    setMostrarModal(false);
  };

  return (
    <Container className='mensajes-contenedor11'>
      <Row>
        <Col>
          <h3 className="mensajes-titulo11">Mensajes</h3>
          <ListGroup className="mensajes-lista11">
            {mensajes.length > 0 ? (
              mensajes.map((mensaje) => (
                <ListGroup.Item
                  key={mensaje.id}
                  className="mensaje-item11 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong className="mensaje-nombre11">{mensaje.nombres}</strong> - {mensaje.correo}
                  </div>
                  <div>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleVerMensaje(mensaje)}
                      className="btn-ver11"
                    >
                      Ver
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleEliminarMensaje(mensaje.id)}
                      className="btn-eliminar11"
                    >
                      Eliminar
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <p className="sin-mensajes11">No hay mensajes disponibles.</p>
            )}
          </ListGroup>
        </Col>
      </Row>

      <Modal show={mostrarModal} onHide={handleCerrarModal} className="mensaje-modal11">
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="modal-titulo11">Detalles del Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mensajeSeleccionado && (
            <>
              <p><strong>Nombre:</strong> {mensajeSeleccionado.nombres}</p>
              <p><strong>Correo:</strong> {mensajeSeleccionado.correo}</p>
              <p><strong>Teléfono:</strong> {mensajeSeleccionado.telefono}</p>
              <p><strong>Ciudad:</strong> {mensajeSeleccionado.ciudad || 'No especificada'}</p>
              <p><strong>Mensaje:</strong> {mensajeSeleccionado.mensaje}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCerrarModal} className="btn-cerrar11">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Mensajes;
