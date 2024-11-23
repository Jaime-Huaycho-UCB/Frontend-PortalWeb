import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { enviarSolicitud } from '../../librerias/PeticionesApi'; // Ajusta la ruta según tu estructura de proyecto

const EnviarSolicitud = () => {
  const [solicitud, setSolicitud] = useState({
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    telefono: '',
    ciudad: '',
    mensaje: '',
  });

  const handleChange = (campo, valor) => {
    setSolicitud((prevSolicitud) => ({
      ...prevSolicitud,
      [campo]: valor,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Enviando datos:', solicitud);
      const response = await enviarSolicitud(solicitud);
      console.log('Solicitud enviada con éxito:', response);
      alert('Solicitud enviada exitosamente.');
      setSolicitud({
        nombres: '',
        primerApellido: '',
        segundoApellido: '',
        correo: '',
        telefono: '',
        ciudad: '',
        mensaje: '',
      });
    } catch (error) {
      console.error('Error al enviar la solicitud:', error.response?.data || error.message);
      alert(`Error al enviar la solicitud: ${error.response?.data?.mensaje || 'Intente nuevamente más tarde.'}`);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3 className="mt-4">Enviar Solicitud</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNombres">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tus nombres"
                value={solicitud.nombres}
                onChange={(e) => handleChange('nombres', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrimerApellido">
              <Form.Label>Primer Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu primer apellido"
                value={solicitud.primerApellido}
                onChange={(e) => handleChange('primerApellido', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSegundoApellido">
              <Form.Label>Segundo Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu segundo apellido"
                value={solicitud.segundoApellido}
                onChange={(e) => handleChange('segundoApellido', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCorreo">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                value={solicitud.correo}
                onChange={(e) => handleChange('correo', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu teléfono"
                value={solicitud.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCiudad">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu ciudad (opcional)"
                value={solicitud.ciudad}
                onChange={(e) => handleChange('ciudad', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMensaje">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Ingresa tu mensaje"
                value={solicitud.mensaje}
                onChange={(e) => handleChange('mensaje', e.target.value)}
                required
              />
            </Form.Group>
            <Button className="mt-3" variant="primary" type="submit">
              Enviar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EnviarSolicitud;
