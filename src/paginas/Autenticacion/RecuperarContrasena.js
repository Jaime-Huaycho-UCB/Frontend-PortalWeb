import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import '../../estilos/AdministradorEstilos/RecuperrarContrasena.css';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Correo enviado a ${email} para recuperar la contraseña`);
  };

  return (
    <Container className="recuperar-container">
      <h2 className="text-center">Recuperar Contraseña</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="btn-recuperar">
          Enviar Correo
        </Button>
      </Form>
    </Container>
  );
};

export default RecuperarContrasena;
