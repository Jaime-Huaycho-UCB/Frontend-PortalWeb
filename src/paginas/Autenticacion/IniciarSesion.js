// IniciarSesion.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, Alert, Paper } from '@mui/material';
import { AuthContext } from '../../contextos/ContextoAutenticacion';
import axios from 'axios';
import '../../estilos/AdministradorEstilos/IniciarSesion.css';

const IniciarSesion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { iniciarSesion } = useContext(AuthContext);

  const manejarInicioSesion = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://backend-portalweb-production.up.railway.app/usuario/inicioSesion', {
        correo: email,
        contrasena: password,
      });

      const { salida, mensaje, id, permiso, idUsuario, idDocente, token } = response.data;

      if (salida) {
        iniciarSesion(parseInt(permiso, 10), idUsuario, idDocente, token);
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
    <Box className="login-background">
      {/* Video de fondo */}
      <video autoPlay loop muted className="background-video">
        <source src="/UCB.mp4" type="video/mp4" />
        Tu navegador no soporta el video en HTML5.
      </video>

      {/* Contenedor de inicio de sesión */}
      <Paper className="login-container" elevation={3}>
        <Typography  className="login-title">
          Iniciar Sesión
        </Typography>
        {error && (
          <Alert severity="error" className="login-error">
            {error}
          </Alert>
        )}
        <form onSubmit={manejarInicioSesion}>
          <TextField
            label="Correo Electrónico"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
            <FormControlLabel control={<Checkbox className="login-checkbox" />} label="Recuérdame" />
            <Button href="/recuperar-contrasena" variant="text" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Button>
          </Box>

          <Button type="submit" variant="contained" fullWidth className="login-button">
            Iniciar Sesión
          </Button>

          <Typography variant="body2" className="register-link">
            ¿No tienes cuenta?{' '}
            <Button href="/registro" variant="text" className="register-button">
              Registrarse
            </Button>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default IniciarSesion;
