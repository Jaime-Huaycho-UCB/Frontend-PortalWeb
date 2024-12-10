import React, { useState, useEffect, useContext, useCallback } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import {
    Card, CardContent, Typography, Box, Dialog, DialogContent, DialogTitle,
    TextField, Button, DialogActions, IconButton, Tooltip,FormControl,InputLabel,Select,MenuItem
} from '@mui/material';
import { Event, Edit, Delete, Close, Add } from '@mui/icons-material';
import { agregarEvento, obtenerEventos, actualizarEvento, eliminarEvento,manejarCambioFoto } from '../../../librerias/PeticionesApi';
import { AuthContext } from '../../../contextos/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const GestionEventos = () => {
    const { idUsuario, token, cerrarSesion } = useContext(AuthContext);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [eventos, setEventos] = useState([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [nuevoEvento, setNuevoEvento] = useState({
        nombre: '',
        descripcion: '',
        director: '',
        fecha: '',
        lugar: '',
        fotoBase64: '',
    });

    const cargarEventos = useCallback(async (id) => {
        try {
            const data = await obtenerEventos(id);
            if (data.salida) {
                setEventos(data.eventos);
            } else {
                if(!data.salida){
                setEventos([]);
            }else if (data.mensaje === 'TKIN') {
                cerrarSesion();
                navigate('/iniciar-sesion');
            }
        }
            
        } catch (error) {
            console.error(error);
        }
    }, [cerrarSesion, navigate]);

    useEffect(() => {
        cargarEventos(0);
    }, [cargarEventos]);

    const agregarNuevoEvento = useCallback(async () => {
        // Validaciones
        if (!nuevoEvento.nombre.trim()) {
            Swal.fire({
                title: 'Nombre Requerido',
                text: 'El nombre del evento no puede estar vacío.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!/^[a-zA-Z\s]+$/.test(nuevoEvento.nombre)) {
            Swal.fire({
                title: 'Nombre Inválido',
                text: 'El nombre del evento solo puede contener letras y espacios.',
                icon: 'warning',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!nuevoEvento.descripcion.trim()) {
            Swal.fire({
                title: 'Descripción Requerida',
                text: 'La descripción del evento no puede estar vacía.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!nuevoEvento.director.trim()) {
            Swal.fire({
                title: 'Director Requerido',
                text: 'El nombre del director del evento no puede estar vacío.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!/^[a-zA-Z\s]+$/.test(nuevoEvento.director)) {
            Swal.fire({
                title: 'Director Inválido',
                text: 'El nombre del director solo puede contener letras y espacios.',
                icon: 'warning',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!nuevoEvento.fecha.trim()) {
            Swal.fire({
                title: 'Fecha Requerida',
                text: 'La fecha del evento no puede estar vacía.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(nuevoEvento.fecha)) {
            Swal.fire({
                title: 'Fecha Inválida',
                text: 'La fecha debe estar en formato YYYY-MM-DD.',
                icon: 'warning',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!nuevoEvento.lugar.trim()) {
            Swal.fire({
                title: 'Lugar Requerido',
                text: 'El lugar del evento no puede estar vacío.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!nuevoEvento.fotoBase64.trim()) {
            Swal.fire({
                title: 'Foto Requerida',
                text: 'Debes subir una foto para el evento.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        try {
            const response = await agregarEvento(nuevoEvento, idUsuario, token);
    
            if (!response.salida) {
                if (response.mensaje === 'TKIN') {
                    Swal.fire({
                        title: 'Sesión Expirada',
                        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                        icon: 'warning',
                        confirmButtonText: 'Iniciar Sesión',
                        confirmButtonColor: '#d33',
                    }).then(() => {
                        cerrarSesion();
                        navigate('/iniciar-sesión');
                    });
                    setShowModal(false);
                    return;
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.mensaje,
                        icon: 'error',
                        confirmButtonText: 'Cerrar',
                    });
                    setShowModal(false);
                    return;
                }
            }
    
            Swal.fire({
                title: 'Evento Agregado',
                text: response.mensaje,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6',
            });
    
            cargarEventos();
            setShowModal(false);
            setNuevoEvento({ nombre: '', descripcion: '', director: '', fecha: '', lugar: '', fotoBase64: '' });
        } catch (error) {
            console.error('Error al agregar evento:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al agregar el evento. Por favor, inténtalo más tarde.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
        }
    }, [cargarEventos, cerrarSesion, navigate, nuevoEvento, idUsuario, token]);
    
    const iniciarEdicion = (evento) => {
        setIsUpdating(true);
        setEventoSeleccionado(evento.id);
        setNuevoEvento({
            nombre: evento.nombre,
            descripcion: evento.descripcion,
            director: evento.director,
            fecha: evento.fecha,
            lugar: evento.lugar,
            fotoBase64:null,
        });
        setShowModal(true);
    };

    
    const actualizarEventoExistente = useCallback(async () => {
        // Validaciones
        if (!nuevoEvento.nombre.trim()) {
            Swal.fire({
                title: 'Nombre Requerido',
                text: 'El nombre del evento no puede estar vacío.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!/^[a-zA-Z\s]+$/.test(nuevoEvento.nombre)) {
            Swal.fire({
                title: 'Nombre Inválido',
                text: 'El nombre del evento solo puede contener letras y espacios.',
                icon: 'warning',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!nuevoEvento.descripcion.trim()) {
            Swal.fire({
                title: 'Descripción Requerida',
                text: 'La descripción del evento no puede estar vacía.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!nuevoEvento.director.trim()) {
            Swal.fire({
                title: 'Director Requerido',
                text: 'El nombre del director del evento no puede estar vacío.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!/^[a-zA-Z\s]+$/.test(nuevoEvento.director)) {
            Swal.fire({
                title: 'Director Inválido',
                text: 'El nombre del director solo puede contener letras y espacios.',
                icon: 'warning',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!nuevoEvento.fecha.trim()) {
            Swal.fire({
                title: 'Fecha Requerida',
                text: 'La fecha del evento no puede estar vacía.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(nuevoEvento.fecha)) {
            Swal.fire({
                title: 'Fecha Inválida',
                text: 'La fecha debe estar en formato YYYY-MM-DD.',
                icon: 'warning',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
        if (!nuevoEvento.lugar.trim()) {
            Swal.fire({
                title: 'Lugar Requerido',
                text: 'El lugar del evento no puede estar vacío.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
            return;
        }
    
      
        const eventoActualizado = { 
            ...nuevoEvento, 
            fotoBase64: nuevoEvento.fotoBase64 ? nuevoEvento.fotoBase64 : null 
        };
    
        try {
            const response = await actualizarEvento(eventoSeleccionado, eventoActualizado, idUsuario, token);
    
            if (!response.salida) {
                if (response.mensaje === 'TKIN') {
                    Swal.fire({
                        title: 'Sesión Expirada',
                        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                        icon: 'warning',
                        confirmButtonText: 'Iniciar Sesión',
                        confirmButtonColor: '#d33',
                    }).then(() => {
                        cerrarSesion();
                        navigate('/iniciar-sesión');
                    });
                    setShowModal(false);
                    return;
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.mensaje,
                        icon: 'error',
                        confirmButtonText: 'Cerrar',
                    });
                    setShowModal(false);
                    return;
                }
            }
    
            Swal.fire({
                title: 'Evento Actualizado',
                text: response.mensaje,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6',
            });
    
            cargarEventos(0);
            setShowModal(false);
            setIsUpdating(false);
            setNuevoEvento({ nombre: '', descripcion: '', director: '', fecha: '', lugar: '', fotoBase64: '' });
        } catch (error) {
            console.error('Error al actualizar evento:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar el evento. Por favor, inténtalo más tarde.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            setShowModal(false);
        }
    }, [cargarEventos, cerrarSesion, navigate, eventoSeleccionado, nuevoEvento, idUsuario, token]);
    
    const confirmarEliminacion = useCallback(async (id) => {
        try {
            const response = await eliminarEvento(id, idUsuario, token);
    
            if (!response.salida) {
                if (response.mensaje === 'TKIN') {
                    Swal.fire({
                        title: 'Sesión Expirada',
                        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                        icon: 'warning',
                        confirmButtonText: 'Iniciar Sesión',
                        confirmButtonColor: '#d33'
                    }).then(() => {
                        cerrarSesion();
                        navigate('/iniciar-sesión');
                    });
                    setShowModal(false);
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.mensaje || 'No se pudo eliminar el evento.',
                        icon: 'error',
                        confirmButtonText: 'Cerrar'
                    });
                    console.error(response.mensaje);
                }
                setShowModal(false);
                return;
            }
    
            Swal.fire({
                title: 'Evento Eliminado',
                text: response.mensaje || 'El evento se eliminó correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6'
            });
    
            cargarEventos(0); // Recargar eventos después de eliminar
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al intentar eliminar el evento. Por favor, inténtalo más tarde.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        }
    }, [cargarEventos, cerrarSesion, navigate, idUsuario, token]);
    

    const handleFileChange = (e) => {
        manejarCambioFoto(e, (fotoBase64) => {
          setNuevoEvento({ ...nuevoEvento, fotoBase64 });
        });
      };
    
    const [filtroSeleccionado, setFiltroSeleccionado] = useState(0);
    return (
        <Box className="gestion-eventos-container">
            <Typography variant="h4" align="center" gutterBottom>
                Gestión de Eventos
            </Typography>
            
      

            <Box display="flex" justifyContent="center" mb={3}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => {
                        setNuevoEvento({ nombre: '', descripcion: '', director: '', fecha: '', lugar: '', fotoBase64: '' });
                        setShowModal(true);
                        setIsUpdating(false);
                    }}
                    className="add-evento-btn"
                >
                    Agregar Evento
                </Button>
            </Box>
            <FormControl fullWidth margin="dense" className="select-field">
  <InputLabel>Filtrar</InputLabel>
  <Select
    value={filtroSeleccionado} // Estado que controla la selección actual
    onChange={(e) => {
      const filtroId = e.target.value;
      setFiltroSeleccionado(filtroId); // Actualiza el filtro seleccionado
      cargarEventos(filtroId); // Llama a cargarDatos con el filtro correspondiente
    }}
  >
    {/* Opción por defecto */}
    <MenuItem value={0}>Obtener Todo</MenuItem>
    <MenuItem value={1}>Eventos Actuales</MenuItem>
    <MenuItem value={2}>Eventos Pasados</MenuItem>
    
    
  </Select>
</FormControl>
            <VerticalTimeline>
                {eventos.map((evento) => (
                    <VerticalTimelineElement
                        key={evento.id}
                        date={evento.fecha}
                        icon={<Event />}
                        iconStyle={{ background: '#3f51b5', color: '#fff' }}
                    >
                        <Card className="timeline-card">
                            <CardContent>
                                {evento.fotoBase64 && (
                                    <img
                                        src={evento.fotoBase64}
                                        alt={evento.nombre}
                                        style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
                                    />
                                )}
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{evento.nombre}</Typography>
                                <Typography variant="body2" color="textSecondary">Ubicación: {evento.lugar}</Typography>
                                <Typography variant="body2" color="textSecondary">Director: {evento.director}</Typography>
                                <Typography variant="body2" paragraph>{evento.descripcion}</Typography>
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    <Tooltip title="Editar">
                                        <IconButton color="warning" onClick={() => iniciarEdicion(evento)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton color="error" onClick={() => confirmarEliminacion(evento.id)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </CardContent>
                        </Card>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>

            <Dialog open={showModal} onClose={() => { setShowModal(false); setIsUpdating(false); }} fullWidth maxWidth="sm">
                <DialogTitle>
                    {isUpdating ? 'Actualizar Evento' : 'Agregar Nuevo Evento'}
                    <IconButton onClick={() => { setShowModal(false); setIsUpdating(false); }} style={{ position: 'absolute', right: 8, top: 8 }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Nombre del Evento"
                        fullWidth
                        value={nuevoEvento.nombre}
                        onChange={(e) => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Director del Evento"
                        fullWidth
                        value={nuevoEvento.director}
                        onChange={(e) => setNuevoEvento({ ...nuevoEvento, director: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Fecha"
                        fullWidth
                        type="date"
                        value={nuevoEvento.fecha}
                        onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Ubicación"
                        fullWidth
                        value={nuevoEvento.lugar}
                        onChange={(e) => setNuevoEvento({ ...nuevoEvento, lugar: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Descripción"
                        fullWidth
                        multiline
                        rows={3}
                        value={nuevoEvento.descripcion}
                        onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
                        margin="normal"
                    />
                   <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
        Subir Foto
        <input
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </Button>

      {/* Vista previa de la imagen cargada */}
      {nuevoEvento.fotoBase64 && (
        <img
          src={`${nuevoEvento.fotoBase64}`} // Asumiendo que es JPEG
          alt="Vista previa"
          style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }}
        />
      )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setShowModal(false); setIsUpdating(false); }} color="secondary">Cerrar</Button>
                    <Button onClick={isUpdating ? actualizarEventoExistente : agregarNuevoEvento} color="primary">
                        {isUpdating ? 'Actualizar' : 'Agregar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GestionEventos;
