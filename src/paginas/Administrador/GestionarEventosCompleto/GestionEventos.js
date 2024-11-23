import React, { useState, useEffect, useContext, useCallback } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import {
    Card, CardContent, Typography, Box, Dialog, DialogContent, DialogTitle,
    TextField, Button, DialogActions, IconButton, Tooltip
} from '@mui/material';
import { Event, Edit, Delete, Close, Add } from '@mui/icons-material';
import { agregarEvento, obtenerEventos, actualizarEvento, eliminarEvento } from '../../../librerias/PeticionesApi';
import { AuthContext } from '../../../contextos/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';

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

    const cargarEventos = useCallback(async () => {
        try {
            const data = await obtenerEventos();
            if (data.salida) {
                setEventos(data.eventos);
            } else if (data.mensaje === 'TKIN') {
                cerrarSesion();
                navigate('/iniciar-sesion');
            }
        } catch (error) {
            console.error(error);
        }
    }, [cerrarSesion, navigate]);

    useEffect(() => {
        cargarEventos();
    }, [cargarEventos]);

    const agregarNuevoEvento = useCallback(async () => {
        try {
            const response = await agregarEvento(nuevoEvento, idUsuario, token);
            if (!response.salida) {
                if (response.mensaje === 'TKIN') {
                    cerrarSesion();
                    navigate('/iniciar-sesion');
                } else {
                    console.error(response.mensaje);
                }
                return;
            }
            cargarEventos();
            setShowModal(false);
            setNuevoEvento({ nombre: '', descripcion: '', director: '', fecha: '', lugar: '', fotoBase64: '' });
        } catch (error) {
            console.error(error);
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
            fotoBase64: evento.fotoBase64 || '',
        });
        setShowModal(true);
    };

    const actualizarEventoExistente = useCallback(async () => {
        try {
            const response = await actualizarEvento(eventoSeleccionado, nuevoEvento, idUsuario, token);
            if (!response.salida) {
                if (response.mensaje === 'TKIN') {
                    cerrarSesion();
                    navigate('/iniciar-sesion');
                } else {
                    console.error(response.mensaje);
                }
                return;
            }
            cargarEventos();
            setShowModal(false);
            setIsUpdating(false);
            setNuevoEvento({ nombre: '', descripcion: '', director: '', fecha: '', lugar: '', fotoBase64: '' });
        } catch (error) {
            console.error(error);
        }
    }, [cargarEventos, cerrarSesion, navigate, eventoSeleccionado, nuevoEvento, idUsuario, token]);

    const confirmarEliminacion = useCallback(async (id) => {
        try {
            const response = await eliminarEvento(id, idUsuario, token);
            if (!response.salida) {
                if (response.mensaje === 'TKIN') {
                    cerrarSesion();
                    navigate('/iniciar-sesion');
                } else {
                    console.error(response.mensaje);
                }
                return;
            }
            cargarEventos();
        } catch (error) {
            console.error(error);
        }
    }, [cargarEventos, cerrarSesion, navigate, idUsuario, token]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNuevoEvento((prevEvento) => ({ ...prevEvento, fotoBase64: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

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
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    {nuevoEvento.fotoBase64 && (
                        <img
                            src={nuevoEvento.fotoBase64}
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
