// src/paginas/Administrador/CrearUsuarioSuperior.js
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import '../../estilos/AdministradorEstilos/CrearUsuarioSuperior.css';

const CrearUsuarioSuperior = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (nombre && email && password) {
      setMensaje('Usuario Superior creado exitosamente');
      setNombre('');
      setEmail('');
      setPassword('');
    } else {
      setMensaje('Por favor completa todos los campos');
    }
  };

  return (
    <Container className="crear-usuario-superior-container">
      <h2 className="titulo">Crear Usuario Superior</h2>
      {mensaje && <Alert variant="info">{mensaje}</Alert>}
      <Form onSubmit={manejarEnvio}>
        <Form.Group controlId="formNombre" className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa el nombre del usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa el email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

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
