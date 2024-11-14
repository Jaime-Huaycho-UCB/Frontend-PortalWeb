import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Dialog, DialogContent, TextField, IconButton, DialogActions, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation } from 'react-router-dom';
import { agregarTesis, obtenerTesis, eliminarTesis } from '../../librerias/PeticionesApi';
import { AuthContext } from '../../contextos/ContextoAutenticacion';

const GestionTesis = () => {
    const { idUsuario, token } = useContext(AuthContext);
    const location = useLocation();
    const [openDialog, setOpenDialog] = useState(location.state?.openModal || false);
    const [idEstudiante, setIdEstudiante] = useState(location.state?.idEstudiante || null);
    const [nuevoTesis, setNuevoTesis] = useState({
        titulo: '',
        fechaPublicacion: '',
        tesis: '',
        resumen: '',
    });
    const [tesisList, setTesisList] = useState([]);

    useEffect(() => {
        const cargarTesis = async () => {
            try {
                const tesisData = await obtenerTesis();
                if (tesisData.salida) {
                    setTesisList(tesisData.tesises);
                }
            } catch (error) {
                console.error("Error al obtener tesis:", error);
            }
        };
        cargarTesis();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoTesis({ ...nuevoTesis, [name]: value });
    };

    const handlePdfUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            setNuevoTesis({ ...nuevoTesis, tesis: base64 });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        const tesisData = {
            titulo: nuevoTesis.titulo,
            fechaPublicacion: nuevoTesis.fechaPublicacion,
            tesis: nuevoTesis.tesis,
            resumen: nuevoTesis.resumen,
        };
        try {
            const response = await agregarTesis(tesisData, idUsuario, token, idEstudiante);
            if (response.salida) {
                alert("Tesis agregada exitosamente");
                setTesisList([...tesisList, response.tesis]);
            } else {
                alert("Error al agregar la tesis: " + response.mensaje);
            }
        } catch (error) {
            console.error("Error:", error);
        }
        setOpenDialog(false);
    };

    const handleDelete = async (idTesis) => {
        try {
            const response = await eliminarTesis(idTesis, idUsuario, token);
            if (response.salida) {
                alert("Tesis eliminada exitosamente");
                setTesisList(tesisList.filter((tesis) => tesis.id !== idTesis));
            } else {
                alert("Error al eliminar la tesis: " + response.mensaje);
            }
        } catch (error) {
            console.error("Error al eliminar la tesis:", error);
        }
    };

    const closeDialog = () => setOpenDialog(false);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Gestión de Tesis
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{ mb: 4 }}
            >
                Agregar Tesis
            </Button>

            {/* Lista de Tesis */}
            <Grid container spacing={2}>
                {tesisList.map((tesis) => (
                    <Grid item xs={12} md={6} lg={4} key={tesis.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{tesis.titulo}</Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Fecha de Publicación: {tesis.fechaPublicacion}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Resumen: {tesis.resumen}
                                </Typography>

                                {/* Mostrar detalles del estudiante si existen */}
                                {tesis.estudiante && (
                                    <>
                                        <Typography variant="subtitle2" color="primary">
                                            Información del Estudiante
                                        </Typography>
                                        <Typography variant="body2">
                                            Nombre: {tesis.estudiante.nombre}
                                        </Typography>
                                        <Typography variant="body2">
                                            Nivel Academico: {tesis.estudiante.nivelAcademico}
                                        </Typography>
                                        <Typography variant="body2">
                                            Correo: {tesis.estudiante.correo}
                                        </Typography>

                                        {/* Mostrar foto si está disponible */}
                                        {tesis.estudiante.foto && (
                                            <Box
                                                component="img"
                                                src={tesis.estudiante.foto}
                                                alt="Foto del Estudiante"
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: '50%',
                                                    mt: 2,
                                                }}
                                            />
                                        )}
                                    </>
                                )}

                                {/* Botón para ver PDF */}
                                <Link
                                    href={`data:application/pdf;base64,${tesis.tesis}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="body2"
                                    color="primary"
                                    sx={{ display: 'block', mt: 2 }}
                                >
                                    Ver Contenido PDF
                                </Link>

                                <Button
                                    startIcon={<DeleteIcon />}
                                    color="secondary"
                                    onClick={() => handleDelete(tesis.id)}
                                    sx={{ mt: 2 }}
                                >
                                    Eliminar
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialogo para agregar nueva tesis */}
            <Dialog open={openDialog} onClose={closeDialog} fullWidth maxWidth="md">
                <DialogContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Agregar Nueva Tesis</Typography>
                        <IconButton onClick={closeDialog}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <TextField
                        label="Título"
                        name="titulo"
                        fullWidth
                        margin="normal"
                        value={nuevoTesis.titulo}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Fecha de Publicación"
                        name="fechaPublicacion"
                        fullWidth
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        value={nuevoTesis.fechaPublicacion}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Resumen"
                        name="resumen"
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        value={nuevoTesis.resumen}
                        onChange={handleInputChange}
                    />
                    <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                        Subir PDF
                        <input type="file" hidden accept="application/pdf" onChange={handlePdfUpload} />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GestionTesis;
