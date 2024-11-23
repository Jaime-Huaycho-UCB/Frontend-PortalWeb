import React, { useState, useEffect, useContext } from 'react';
import { obtenerMensajes, eliminarMensaje } from '../../librerias/PeticionesApi.js'; // Ajusta la ruta
import { Container, Row, Col, ListGroup, Button, Modal } from 'react-bootstrap';
import { AuthContext } from '../../contextos/ContextoAutenticacion.js';

const Mensajes = () => {
  const { idUsuario, token } = useContext(AuthContext);
  const [mensajes, setMensajes] = useState([]);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para cargar mensajes desde el backend
  const fetchMensajes = async () => {
    try {
      const data = await obtenerMensajes(idUsuario, token);
      setMensajes(data.solicitudes || []);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  };

  // Cargar mensajes al montar el componente
  useEffect(() => {
    fetchMensajes();
  }, []);

  // Función para eliminar un mensaje
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

  // Función para mostrar el contenido de un mensaje
  const handleVerMensaje = (mensaje) => {
    setMensajeSeleccionado(mensaje);
    setMostrarModal(true);
  };

  // Función para cerrar el modal
  const handleCerrarModal = () => {
    setMensajeSeleccionado(null);
    setMostrarModal(false);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3 className="mt-4">Mensajes</h3>
          <ListGroup>
            {mensajes.length > 0 ? (
              mensajes.map((mensaje) => (
                <ListGroup.Item key={mensaje.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{mensaje.nombres}</strong> - {mensaje.correo}
                  </div>
                  <div>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleVerMensaje(mensaje)}
                      className="me-2"
                    >
                      Ver
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleEliminarMensaje(mensaje.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <p>No hay mensajes disponibles.</p>
            )}
          </ListGroup>
        </Col>
      </Row>

      {/* Modal para mostrar el contenido del mensaje */}
      <Modal show={mostrarModal} onHide={handleCerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Mensaje</Modal.Title>
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
          <Button variant="secondary" onClick={handleCerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Mensajes;
