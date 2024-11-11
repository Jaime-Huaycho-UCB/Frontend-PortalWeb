import React, { useState, useContext } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Dialog, DialogContent, TextField, IconButton, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useLocation } from 'react-router-dom';
import { agregarTesis } from '../../librerias/PeticionesApi';
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
            const response = await agregarTesis(tesisData,idUsuario,token,idEstudiante);
            if (response.salida) {
                alert("Tesis agregada exitosamente");
               
            } else {
                alert("Error al agregar la tesis: " + response.mensaje);
            }
        } catch (error) {
            console.error("Error:", error);
        }
        setOpenDialog(false);
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
