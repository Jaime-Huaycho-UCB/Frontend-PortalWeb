import React, { useState, useEffect, useContext } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, CardMedia, Grid, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Snackbar, Alert, Switch, FormControlLabel } from '@mui/material';
import { obtenerEstudiantes, agregarEstudiante, actualizarEstudiante, eliminarEstudiante, obtenerNivelesAcademicos } from '../../librerias/PeticionesApi';
import { AuthContext } from '../../contextos/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';

const GestionEstudiantes = () => {
  const { idUsuario, token } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [nivelesAcademicos, setNivelesAcademicos] = useState([]);
  const [show, setShow] = useState(false);
  const [showEliminarDialog, setShowEliminarDialog] = useState(false);
  const [showAgregarTesisDialog, setShowAgregarTesisDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estudianteIdActualizar, setEstudianteIdActualizar] = useState(null);
  const [estudianteIdEliminar, setEstudianteIdEliminar] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const { cerrarSesion } = useContext(AuthContext);

  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: '',
    correo: '',
    nivelAcademico: '',
    foto: '',
  });
  const [nuevaTesis, setNuevaTesis] = useState({
    titulo: '',
    tipo: '',
    fechaPublicacion: '',
    resumen: '',
    contenido: '',
  });

  const [actualizarFoto, setActualizarFoto] = useState(false);
  const [ultimoEstudianteId, setUltimoEstudianteId] = useState(null);

  const setFotoBase64 = (base64) => {
    setNuevoEstudiante((prevEstudiante) => ({ ...prevEstudiante, foto: base64 }));
  };

  useEffect(() => {
    setLoading(true);
    obtenerEstudiantes()
      .then((data) => {
        if (data.salida) setEstudiantes(data.estudiantes);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setSnackbar({ open: true, message: 'Error al cargar estudiantes', severity: 'error' });
      });

    obtenerNivelesAcademicos()
      .then((niveles) => {
        setNivelesAcademicos(niveles);
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({ open: true, message: 'Error al cargar niveles académicos', severity: 'error' });
      });
  }, []);

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setActualizarFoto(false);
    setNuevoEstudiante({
      nombre: '',
      correo: '',
      nivelAcademico: '',
      foto: '',
    });
  };

  const handleShow = () => setShow(true);

  const agregarNuevoEstudiante = async () => {
    setLoading(true);
    const estudianteData = {
      ...nuevoEstudiante,
    };

    try {
      const response = await agregarEstudiante(estudianteData, idUsuario, token);
      setLoading(false);
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
          cerrarSesion();
          navigate('/iniciar-sesion');
          return;
        } else {
          console.error(response.mensaje);
          setSnackbar({ open: true, message: response.mensaje, severity: 'error' });
        }
      } else {
        setUltimoEstudianteId(response.estudianteId);
        obtenerEstudiantes().then((data) => setEstudiantes(data.estudiantes));
        handleClose();
        setSnackbar({ open: true, message: 'Estudiante agregado con éxito', severity: 'success' });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setSnackbar({ open: true, message: 'Error al agregar estudiante', severity: 'error' });
    }
  };

  const iniciarEliminacion = (id) => {
    setEstudianteIdEliminar(id);
    setShowEliminarDialog(true);
  };

  const confirmarEliminacion = async () => {
    setLoading(true);
    try {
      const response = await eliminarEstudiante(estudianteIdEliminar, idUsuario, token);
      setLoading(false);
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
          cerrarSesion();
          navigate('/iniciar-sesion');
          return;
        } else {
          console.error(response.mensaje);
          setSnackbar({ open: true, message: response.mensaje, severity: 'error' });
        }
      } else {
        obtenerEstudiantes().then((data) => setEstudiantes(data.estudiantes));
        setShowEliminarDialog(false);
        setEstudianteIdEliminar(null);
        setSnackbar({ open: true, message: 'Estudiante eliminado con éxito', severity: 'success' });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setSnackbar({ open: true, message: 'Error al eliminar estudiante', severity: 'error' });
    }
  };

  const iniciarActualizacion = (estudiante) => {
    setIsUpdating(true);
    setEstudianteIdActualizar(estudiante.id);
    setNuevoEstudiante(estudiante);
    setActualizarFoto(false);
    handleShow();
  };

  const actualizarEstudianteExistente = async () => {
    setLoading(true);
    const estudianteData = {
      ...nuevoEstudiante,
      foto: actualizarFoto ? nuevoEstudiante.foto : null,
    };

    try {
      const response = await actualizarEstudiante(estudianteIdActualizar, estudianteData, idUsuario, token);
      setLoading(false);
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
          cerrarSesion();
          navigate('/iniciar-sesion');
          return;
        } else {
          console.error(response.mensaje);
          setSnackbar({ open: true, message: response.mensaje, severity: 'error' });
        }
      } else {
        obtenerEstudiantes().then((data) => setEstudiantes(data.estudiantes));
        handleClose();
        setSnackbar({ open: true, message: 'Estudiante actualizado con éxito', severity: 'success' });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setSnackbar({ open: true, message: 'Error al actualizar estudiante', severity: 'error' });
    }
  };

  return (
    <div className="gestion-estudiantes-container">
      <h2>Gestión de Estudiantes</h2>
      <Button variant="contained" color="primary" onClick={handleShow}>
        {loading ? <CircularProgress size={24} /> : 'Agregar Estudiante'}
      </Button>

      {ultimoEstudianteId && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setShowAgregarTesisDialog(true)}
          style={{ insetInlineStart: 16 }}        >
          Agregar Tesis
        </Button>
      )}

      <Grid container spacing={2} style={{ insetBlockStart: 16 }}
>
        {estudiantes.map((estudiante) => (
          <Grid item xs={12} sm={6} md={4} key={estudiante.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={estudiante.foto || 'https://cdn-icons-png.freepik.com/256/2307/2307607.png'}
                alt="Foto del Estudiante"
              />
              <CardContent>
                <h3>{estudiante.nombre}</h3>
                <p>Email: {estudiante.correo || 'N/A'}</p>
                <p>Nivel Académico: {estudiante.nivelAcademico || 'N/A'}</p>
                <Button variant="contained" color="warning" onClick={() => iniciarActualizacion(estudiante)} style={{ insetInlineEnd: 8 }}>
                  Actualizar
                </Button>
                <Button variant="contained" color="error" onClick={() => iniciarEliminacion(estudiante.id)}>
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>{isUpdating ? 'Actualizar Estudiante' : 'Agregar Estudiante'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={nuevoEstudiante.nombre}
            onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, nombre: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={nuevoEstudiante.correo}
            onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, correo: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Nivel Académico</InputLabel>
            <Select
              value={nuevoEstudiante.nivelAcademico}
              onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, nivelAcademico: e.target.value })}
            >
              <MenuItem value="">Selecciona un nivel</MenuItem>
              {nivelesAcademicos.map((nivel) => (
                <MenuItem key={nivel.id} value={nivel.id}>
                  {nivel.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch checked={actualizarFoto} onChange={() => setActualizarFoto(!actualizarFoto)} />}
            label="Actualizar Foto"
          />
          {actualizarFoto && (
            <Button
              variant="contained"
              component="label"
              style={{ insetBlockStart: 8 }}
            >
              Subir Foto
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFotoBase64(reader.result.split(',')[1]);
                  };
                  if (file) reader.readAsDataURL(file);
                }}
              />
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={isUpdating ? actualizarEstudianteExistente : agregarNuevoEstudiante} color="primary">
            {loading ? <CircularProgress size={24} /> : isUpdating ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEliminarDialog} onClose={() => setShowEliminarDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar este estudiante?</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEliminarDialog(false)} color="secondary">Cancelar</Button>
          <Button onClick={confirmarEliminacion} color="error">
            {loading ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} style={{ inlineSize: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GestionEstudiantes;
