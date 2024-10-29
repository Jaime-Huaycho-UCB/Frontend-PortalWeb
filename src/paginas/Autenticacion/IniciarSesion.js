// IniciarSesion.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { AuthContext } from '../../contextos/ContextoAutenticacion'; // Importa el contexto de autenticación
import '../../estilos/AdministradorEstilos/IniciarSesion.css';
import axios from 'axios';
const IniciarSesion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { iniciarSesion } = useContext(AuthContext); 

  const manejarInicioSesion = async (e) => {
    e.preventDefault();

    try {
    
      const response = await axios.post('http://localhost:8000/usuario/inicioSesion', {
        correo: email,
        contrasena: password
      });

      const { salida, mensaje, id , permiso } = response.data;

      if (salida) {
        iniciarSesion(permiso); 
        navigate('/admin');
      } else {
        setError(mensaje || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error en la autenticación. Inténtalo nuevamente.');
      console.error(err);
    }
  };

  return (
    <div className="login-background">
      <Container className="login-container">
        <h2 className="login-title">Iniciar Sesión</h2>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={manejarInicioSesion}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <div className="input-container">
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="fa fa-user icon"></i>
            </div>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <div className="input-container">
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="fa fa-lock icon"></i>
            </div>
          </Form.Group>

          <div className="form-options">
            <Form.Check label="Recuérdame" />
            <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
          </div>

          <Button variant="primary" type="submit" className="login-button mt-3">
            Iniciar Sesión
          </Button>

          <p className="register-link mt-3">
            ¿No tienes cuenta? <a href="/registro">Registrarse</a>
          </p>
        </Form>
      </Container>
    </div>
  );
};

export default IniciarSesion;
