// src/paginas/Administrador/CrearUsuarioSuperior.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { obtenerDocentes } from '../../librerias/PeticionesApi';
import '../../estilos/AdministradorEstilos/CrearUsuarioSuperior.css';

const CrearUsuarioSuperior = () => {
  const BASE_URL = 'http://localhost:8000'; // Asegúrate de tener definida la URL base
  const [docentes, setDocentes] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const cargarDocentes = async () => {
      try {
        const data = await obtenerDocentes(BASE_URL, '', '');
        if (data.salida) setDocentes(data.docentes);
      } catch (error) {
        console.error("Error al cargar docentes:", error);
      }
    };

    cargarDocentes();
  }, [BASE_URL]);

  const manejarSeleccionDocente = (e) => {
    const idDocente = e.target.value;
    const docente = docentes.find(d => d.id === parseInt(idDocente, 10));
    setDocenteSeleccionado(docente);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (docenteSeleccionado && password) {
      // Enviar los datos para crear el usuario (aquí agregarías la lógica de la API para crear usuario)
      setMensaje(`Usuario para ${docenteSeleccionado.nombre} creado exitosamente.`);
      setDocenteSeleccionado(null);
      setPassword('');
    } else {
      setMensaje('Por favor selecciona un docente y completa la contraseña.');
    }
  };

  return (
    <Container className="crear-usuario-superior-container">
      <h2 className="titulo">Crear Usuario Superior</h2>
      {mensaje && <Alert variant="info">{mensaje}</Alert>}
      <Form onSubmit={manejarEnvio}>

        <Form.Group controlId="formDocente" className="mb-3">
          <Form.Label>Selecciona un Docente</Form.Label>
          <Form.Control as="select" onChange={manejarSeleccionDocente} value={docenteSeleccionado ? docenteSeleccionado.id : ''}>
            <option value="">Selecciona un docente</option>
            {docentes.map((docente) => (
              <option key={docente.id} value={docente.id}>
                {docente.nombre} ({docente.email})
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {docenteSeleccionado && (
          <>
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={docenteSeleccionado.nombre}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={docenteSeleccionado.correo}
                readOnly
              />
            </Form.Group>
          </>
        )}

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa una contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Crear Usuario
        </Button>
      </Form>
    </Container>
  );
};

export default CrearUsuarioSuperior;
