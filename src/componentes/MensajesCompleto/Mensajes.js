import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Importación para realizar peticiones HTTP
import { obtenerMensajes, eliminarMensaje } from '../../librerias/PeticionesApi.js';
import { Container, Row, Col, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { AuthContext } from '../../contextos/ContextoAutenticacion.js';
import './mesaje.css';

const Mensajes = () => {
  const { idUsuario,token } = useContext(AuthContext); // Quité el token porque no se usará
  const [mensajes, setMensajes] = useState([]);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalRespuesta, setMostrarModalRespuesta] = useState(false);
  const [respuesta, setRespuesta] = useState('');

  const fetchMensajes = async () => {
    try {
      const data = await obtenerMensajes(idUsuario , token);
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
      await eliminarMensaje(idSolicitud, idUsuario , token);
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

  const handleAbrirModalRespuesta = (mensaje) => {
    setMensajeSeleccionado(mensaje);
    setRespuesta('');
    setMostrarModalRespuesta(true);
  };

  const handleCerrarModalRespuesta = () => {
    setMensajeSeleccionado(null);
    setMostrarModalRespuesta(false);
  };

  // Función para enviar correo
  const enviarCorreo = async ({ destino, titulo, contenido }) => {
    try {
      const response = await axios.post(
        'http://192.168.1.132:3009/email/enviar', // Cambia la URL según tu configuración
        {
          destino,
          titulo,
          contenido,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw error; // Lanza el error para manejarlo en el frontend
    }
  };
  

  const handleEnviarRespuesta = async () => {
    if (!respuesta.trim()) {
      alert('El mensaje de respuesta no puede estar vacío.');
      return;
    }

    try {
      await enviarCorreo({
        destino: mensajeSeleccionado.correo,
        titulo: 'Respuesta a tu mensaje',
        contenido: respuesta,
      });
      alert('Respuesta enviada exitosamente.');
      handleCerrarModalRespuesta();
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    }
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
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAbrirModalRespuesta(mensaje)}
                      className="btn-responder11"
                    >
                      Responder
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

      <Modal show={mostrarModalRespuesta} onHide={handleCerrarModalRespuesta} className="mensaje-modal-respuesta">
        <Modal.Header closeButton>
          <Modal.Title>Responder Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mensajeSeleccionado && (
            <p>
              <strong>Responder a:</strong> {mensajeSeleccionado.correo}
            </p>
          )}
          <Form.Group>
            <Form.Label>Mensaje de Respuesta</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCerrarModalRespuesta}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEnviarRespuesta}>
            Enviar Respuesta
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Mensajes;
