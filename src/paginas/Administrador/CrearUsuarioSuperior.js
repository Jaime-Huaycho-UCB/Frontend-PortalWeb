import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, Typography, Card, CardContent, CardActions, Grid, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { obtenerDocentes, crearUsuario } from '../../librerias/PeticionesApi';
import '../../estilos/AdministradorEstilos/CrearUsuarioSuperior.css';

const CrearUsuarioSuperior = () => {
  const [docentes, setDocentes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const cargarDocentes = async () => {
      try {
        const data = await obtenerDocentes();
        if (data.salida) setDocentes(data.docentes);
      } catch (error) {
        console.error("Error al cargar docentes:", error);
      }
    };

    cargarDocentes();
  }, []);

  const manejarSeleccionDocente = (docente) => {
    setDocenteSeleccionado(docente);
    setOpenDialog(true);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (docenteSeleccionado && password) {
      try {
        const nuevoUsuario = await crearUsuario(docenteSeleccionado.id, password);
        
        setUsuarios((prev) => [...prev, nuevoUsuario]);
        setMensaje(`Usuario para ${docenteSeleccionado.nombre} creado exitosamente.`);
        
        setDocenteSeleccionado(null);
        setPassword('');
        setOpenDialog(false);
      } catch (error) {
        console.error("Error al crear usuario:", error);
        setMensaje('Error al crear el usuario. Inténtalo nuevamente.');
      }
    } else {
      setMensaje('Por favor selecciona un docente y completa la contraseña.');
    }
  };

  return (
    <Container className="crear-usuario-superior-container">
      <Typography variant="h4" className="titulo" gutterBottom>Crear Usuario Superior</Typography>

      {mensaje && <Alert severity="info">{mensaje}</Alert>}

      <Box mt={3} mb={5}>
        <Typography variant="h6">Selecciona un Docente</Typography>
        <Grid container spacing={3}>
          {docentes.map((docente) => (
            <Grid item xs={12} sm={6} md={4} key={docente.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{docente.nombre}</Typography>
                  <Typography color="textSecondary">{docente.correo}</Typography>
                  <Typography variant="body2" color="textSecondary">ID: {docente.id}</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" color="primary" onClick={() => manejarSeleccionDocente(docente)}>
                    Crear Usuario
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Crear Usuario para {docenteSeleccionado?.nombre}</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            value={docenteSeleccionado?.correo || ''}
            fullWidth
            margin="dense"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Contraseña"
            type="password"
            placeholder="Ingresa una contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancelar</Button>
          <Button onClick={manejarEnvio} color="primary" variant="contained">Crear Usuario</Button>
        </DialogActions>
      </Dialog>

      <Box mt={5}>
        <Typography variant="h6" gutterBottom>Usuarios Creados</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.id}</TableCell>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default CrearUsuarioSuperior;
