import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, CardMedia, Grid, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Snackbar, Alert, Switch, FormControlLabel
} from '@mui/material';
import {
  obtenerEstudiantes, agregarEstudiante, actualizarEstudiante, eliminarEstudiante, obtenerNivelesAcademicos
} from '../../librerias/PeticionesApi';
import { AuthContext } from '../../contextos/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';
import '../../estilos/AdministradorEstilos/GestionEstudiantes.css';

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

  const [actualizarFoto, setActualizarFoto] = useState(false);
  const [ultimoEstudianteId, setUltimoEstudianteId] = useState(null);

  const setFotoBase64 = (base64) => {
    setNuevoEstudiante((prevEstudiante) => ({ ...prevEstudiante, foto: base64 }));
  };

  useEffect(() => {
    setLoading(true);
    obtenerEstudiantes()
      .then((data) => {
        if (data.salida) setEstudiantes(data.estudiantes || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setSnackbar({ open: true, message: 'Error al cargar estudiantes', severity: 'error' });
      });

    obtenerNivelesAcademicos()
      .then((niveles) => {
        setNivelesAcademicos(niveles.nivelesAcademicos || []);
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
        setSnackbar({ open: true, message: response.mensaje, severity: 'success' });
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

  const agregarTesis = (idEstudiante) => {
    navigate('/admin/gestion-tesis', { state: { openModal: true, idEstudiante } });
};


  return (
    <div className="gestion-estudiantes-container">
      <h2 className="titulo-gestion">Gestión de Estudiantes</h2>
      <Button variant="contained" color="primary" onClick={handleShow} className="add-estudiante-btn">
        {loading ? <CircularProgress size={24} /> : 'Agregar Estudiante'}
      </Button>
      <Grid container spacing={5} className="grid-estudiantes" justifyContent="center">
  {estudiantes.map((estudiante) => (
    <Grid item xs={4} sm={4} md={4} key={estudiante.id}>
      <Card className="card">
        <CardMedia
          component="img"
          className="card-media"
          height="200"
          image={estudiante.foto || 'https://cdn-icons-png.freepik.com/256/2307/2307607.png'}
          alt="Foto del Estudiante"
          style={{ objectFit: 'cover' }}
        />
        <CardContent className="card-content">
          <h3>{estudiante.nombre}</h3>
          <p>Email: {estudiante.correo || 'N/A'}</p>
          <p>Nivel Académico: {estudiante.nivelAcademico || 'N/A'}</p>
          <div className="button-container">
            <Button variant="contained" color="warning" onClick={() => iniciarActualizacion(estudiante)} className="button-update">
              Actualizar
            </Button>
            <Button variant="contained" color="error" onClick={() => iniciarEliminacion(estudiante.id)} className="button-delete">
              Eliminar
            </Button>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => agregarTesis(estudiante.id)}
            className="agregar-tesis-btn"
          >
            Agregar Tesis
          </Button>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


      <Dialog
  open={show}
  onClose={handleClose}
  PaperProps={{
    style: {
      padding: '20px',
      borderRadius: '15px',
      maxInlineSize: '500px', // Correcto: maxInlineSize
      inlineSize: '100%',     // Correcto: inlineSize
      backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo semitransparente
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', // Sombra
      margin: 'auto', // Centrado en la pantalla
    },
  }}
  className="dialog"
>


        <DialogTitle className="dialog-title">{isUpdating ? 'Actualizar Estudiante' : 'Agregar Estudiante'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={nuevoEstudiante.nombre}
            onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, nombre: e.target.value })}
            className="text-field"
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={nuevoEstudiante.correo}
            onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, correo: e.target.value })}
            className="text-field"
          />
          <FormControl fullWidth margin="dense" className="select-field">
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
            className="switch-update-foto"
          />
          {actualizarFoto && (
            <Button
              variant="contained"
              component="label"
              className="upload-button"
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
          <Button onClick={handleClose} color="secondary" className="button-cancelar">Cancelar</Button>
          <Button onClick={isUpdating ? actualizarEstudianteExistente : agregarNuevoEstudiante} color="primary" className="button-guardar">
            {loading ? <CircularProgress size={24} /> : isUpdating ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={showEliminarDialog} onClose={() => setShowEliminarDialog(false)} className="dialog-eliminar">
        <DialogTitle className="dialog-title">Confirmar Eliminación</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar este estudiante?</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEliminarDialog(false)} color="secondary" className="button-cancelar">Cancelar</Button>
          <Button onClick={confirmarEliminacion} color="error" className="button-eliminar">
            {loading ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} className="snackbar-alert">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GestionEstudiantes;
