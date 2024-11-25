import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent,Typography, CardMedia, Grid, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Snackbar, Alert, Switch, FormControlLabel
} from '@mui/material';
import {
  obtenerEstudiantes, agregarEstudiante, actualizarEstudiante, eliminarEstudiante, obtenerNivelesAcademicos,obtenerFiltros
} from '../../../librerias/PeticionesApi';
import { AuthContext } from '../../../contextos/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';
import './GestionEstudiantes.css';

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
  const [filtros, setFiltros] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const { cerrarSesion } = useContext(AuthContext);

  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: '',
    correo: '',
    nivelAcademico: '',
    anio: '',
    semestre:'',
    foto: '',
  });

  const [actualizarFoto, setActualizarFoto] = useState(false);
  const [ultimoEstudianteId, setUltimoEstudianteId] = useState(null);

  const setFotoBase64 = (base64) => {
    setNuevoEstudiante((prevEstudiante) => ({ ...prevEstudiante, foto: base64 }));
  };
  const cargarDatos = async (id) => {
    try {
      setLoading(true);
  
      // Obtener estudiantes
      const estudiantesResponse = id === 0 
        ? await obtenerEstudiantes(0) // Trae todos los estudiantes
        : await obtenerEstudiantes(id); // Filtra por el ID
      if (estudiantesResponse.salida) {
        setEstudiantes(estudiantesResponse.estudiantes || []);
      }else{
        setEstudiantes([]);
      }
  
      // Obtener niveles académicos
      const nivelesResponse = await obtenerNivelesAcademicos();
      if (nivelesResponse.salida) {
        setNivelesAcademicos(nivelesResponse.nivelesAcademicos || []);
      }
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Error al cargar datos', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    cargarDatos(0);
    cargarFiltros();
  }, []); // Dependencias permanecen vacías para ejecutarlo solo una vez al montar el componente
  

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setActualizarFoto(false);
    setNuevoEstudiante({
      nombre: '',
      correo: '',
      nivelAcademico: '',
      anio: '',
    semestre:'', 
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
        cargarFiltros();
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
        cargarDatos(0);
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
    console.log(estudiante);
    setIsUpdating(true); // Cambiar el estado para indicar que estamos actualizando
    setEstudianteIdActualizar(estudiante.id); // Guardar el ID del estudiante a actualizar
  
    // Configurar los valores del estudiante en el estado
    setNuevoEstudiante({
      nombre: estudiante.nombre || '', // Manejar valores nulos
      correo: estudiante.correo || '',
      nivelAcademico: estudiante.nivelAcademico || '',
      anio: estudiante.anio || '',
      semestre: estudiante.semestre || '',
      foto: estudiante.foto || '',
    });
  
    setActualizarFoto(false); // Por defecto, no actualizar foto
    setTimeout(() => handleShow(), 0); // Abrir el modal después de configurar los valores
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
        cargarDatos(0);
        cargarFiltros();
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

  const cargarFiltros = async () => {
    try {
      const data = await obtenerFiltros();
      if(data.salida){
      console.log(data.semestres);
      setFiltros(data.semestres|| []); // Suponemos que la API devuelve un objeto con la clave "filtros"
      }
    } catch (error) {
      console.error("Error al cargar los filtros:", error);
    }
  };


const [filtroSeleccionado, setFiltroSeleccionado] = useState(0);
  return (
    <div className="gestion-estudiantes-container">
      <h2 className="titulo-gestion">Gestión de Estudiantes</h2>
      <Button variant="contained" color="primary" onClick={handleShow} className="add-estudiante-btn">
        {loading ? <CircularProgress size={24} /> : 'Agregar Estudiante'}
      </Button>
      <Typography variant="h4" align="center" gutterBottom>
        Filtrar Egresados
      </Typography>
      <FormControl fullWidth margin="dense" className="select-field">
  <InputLabel>Filtrar</InputLabel>
  <Select
    value={filtroSeleccionado} // Estado que controla la selección actual
    onChange={(e) => {
      const filtroId = e.target.value;
      setFiltroSeleccionado(filtroId); // Actualiza el filtro seleccionado
      cargarDatos(filtroId); // Llama a cargarDatos con el filtro correspondiente
    }}
  >
    {/* Opción por defecto */}
    <MenuItem value={0}>Obtener Todo</MenuItem>
    {filtros.map((filtro) => (
      <MenuItem key={filtro.id} value={filtro.id}>
        {filtro.cadena}
      </MenuItem>
    ))}
  </Select>
</FormControl>



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
          <p>semestre: {estudiante.semestre || 'N/A'}</p>
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


<Dialog open={show} onClose={handleClose}>
  <DialogTitle>{isUpdating ? 'Actualizar Estudiante' : 'Agregar Estudiante'}</DialogTitle>
  <DialogContent>
    <TextField
      label="Nombre"
      fullWidth
      margin="dense"
      value={nuevoEstudiante.nombre} // Vinculado al estado
      onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, nombre: e.target.value })}
    />
    <TextField
      label="Email"
      fullWidth
      margin="dense"
      value={nuevoEstudiante.correo} // Vinculado al estado
      onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, correo: e.target.value })}
    />
    <TextField
      label="Año"
      fullWidth
      margin="dense"
      type="number"
      value={nuevoEstudiante.anio} // Vinculado al estado
      onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, anio: parseInt(e.target.value, 10) || '' })}
    />
    <FormControl fullWidth margin="dense">
      <InputLabel>Semestre</InputLabel>
      <Select
        value={nuevoEstudiante.semestre || ''}
        onChange={(e) =>
          setNuevoEstudiante({ ...nuevoEstudiante, semestre: parseInt(e.target.value, 10) })
        }
      >
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
      </Select>
    </FormControl>
    <FormControl fullWidth margin="dense">
      <InputLabel>Nivel Académico</InputLabel>
      <Select
        value={nuevoEstudiante.nivelAcademico || ''}
        onChange={(e) =>
          setNuevoEstudiante({ ...nuevoEstudiante, nivelAcademico: e.target.value })
        }
      >
        <MenuItem value="">Selecciona un nivel</MenuItem>
        {nivelesAcademicos.map((nivel) => (
          <MenuItem key={nivel.id} value={nivel.id}>
            {nivel.nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="secondary">Cancelar</Button>
    <Button onClick={isUpdating ? actualizarEstudianteExistente : agregarNuevoEstudiante} color="primary">
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
