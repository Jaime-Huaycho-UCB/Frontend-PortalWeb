import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import '../../estilos/AdministradorEstilos/Registro.css';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const manejarRegistro = (e) => {
    e.preventDefault();

    // Simulamos un registro básico. Se puede agregar una lógica para registrar usuarios en una base de datos.
    if (email && password) {
      // Redirigimos al inicio de sesión después del registro
      navigate('/iniciar-sesion');
    } else {
      setError('Completa todos los campos');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Registro de Administrador</h2>
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={manejarRegistro}>
        <Form.Group controlId="formNombre">
          <Form.Label>Nombre Completo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Crea una contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Registrarse
        </Button>
      </Form>
    </Container>
  );
};

export default Registro;
