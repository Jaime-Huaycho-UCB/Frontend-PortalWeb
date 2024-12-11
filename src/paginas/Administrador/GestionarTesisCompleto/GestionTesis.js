import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Dialog, DialogContent, TextField, IconButton, DialogActions } from '@mui/material';
import { Close as CloseIcon, AddCircleOutline as AddCircleOutlineIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { agregarTesis, obtenerTesis, eliminarTesis, obtenerContenidoTesis } from '../../../librerias/PeticionesApi';
import { AuthContext } from '../../../contextos/ContextoAutenticacion';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import styled, { keyframes } from 'styled-components';
import Swal from 'sweetalert2';
import { set } from 'date-fns';
// Animations and Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledCard = styled(Card)`
  animation: ${fadeIn} 0.5s ease-out;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  &:hover {
    box-shadow: 0px 8px 16px rgba(0, 40, 85, 0.2);
    transform: scale(1.02);
  }
`;

const StyledButton = styled(Button)`
  background-color: #BA0C2F;
  color: #FFFFFF;
  padding: 10px 20px;
  font-size: 16px;
  &:hover {
    background-color: #FFD700;
  }
`;

const PageContainer = styled(Box)`
  padding: 4rem;
  background-color: #F5F5F5;
  min-height: 100vh;
`;

const GestionTesis = () => {
  const { idUsuario, token } = useContext(AuthContext);
  const location = useLocation();

  // States
  const [openDialog, setOpenDialog] = useState(location.state?.openModal || false);
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [idEstudiante, setIdEstudiante] = useState(location.state?.idEstudiante || null);
  const [nuevoTesis, setNuevoTesis] = useState({ titulo: '', fechaPublicacion: '', tesis: '', resumen: '' });
  const [tesisList, setTesisList] = useState([]);

  // Fetch Tesis on Load
  const cargarTesis = async (setTesisList) => {
    try {
      const response = await obtenerTesis();
      if (response.salida) {
        setTesisList(response.tesises);
        console.log(response.tesises);
      } else {
        setTesisList([]);
      }
    } catch (error) {
      console.error('Error al obtener tesis:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar las tesis. Por favor, inténtalo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };
  
  const handleSubmit = async () => {
    // Validaciones
    if (!nuevoTesis.titulo.trim()) {
      Swal.fire({
        title: 'Campo Obligatorio',
        text: 'El título de la tesis es obligatorio.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    if (!nuevoTesis.fechaPublicacion.trim()) {
      Swal.fire({
        title: 'Campo Obligatorio',
        text: 'La fecha de publicación es obligatoria.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    if (!/\d{4}-\d{2}-\d{2}/.test(nuevoTesis.fechaPublicacion)) {
      Swal.fire({
        title: 'Formato Inválido',
        text: 'La fecha de publicación debe estar en formato YYYY-MM-DD.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    if (!nuevoTesis.resumen.trim()) {
      Swal.fire({
        title: 'Campo Obligatorio',
        text: 'El resumen de la tesis es obligatorio.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    if (!nuevoTesis.tesis.trim()) {
      Swal.fire({
        title: 'Archivo Requerido',
        text: 'Debe subir un archivo PDF para la tesis.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    try {
      const response = await agregarTesis(nuevoTesis, idUsuario, token, idEstudiante);
      if (response.salida) {
        Swal.fire({
          title: 'Éxito',
          text: 'Tesis agregada exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        cargarTesis(setTesisList); // Recargar las tesis después de agregar una nueva
        setNuevoTesis({ titulo: '', fechaPublicacion: '', tesis: '', resumen: '' }); // Reiniciar el formulario
        setIdEstudiante(null); // Reiniciar el estudiante
      } else {
        Swal.fire({
          title: 'Error',
          text: response.mensaje,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      console.error('Error al agregar tesis:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al agregar la tesis. Por favor, inténtalo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
    setOpenDialog(false);
  };
  
  // Delete Tesis
  const handleDelete = async (idTesis) => {
    try {
      const response = await eliminarTesis(idTesis, idEstudiante, idUsuario, token);
      if (response.salida) {
        Swal.fire({
          title: 'Éxito',
          text: 'Tesis eliminada exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        cargarTesis(setTesisList);
      } else {
        Swal.fire({
          title: 'Error',
          text: response.mensaje,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      console.error('Error al eliminar tesis:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al eliminar la tesis. Por favor, inténtalo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };
  
  useEffect(() => {
    cargarTesis(setTesisList);
  }, []);
  
  
  // Handle Input Changes
  const updateField = (field, value) => {
    setNuevoTesis((prev) => ({ ...prev, [field]: value }));
  };

  // Handle File Upload
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        updateField('tesis', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open PDF Viewer
  const openPdfModal = async (idTesis) => {
    try {
      const response = await obtenerContenidoTesis(idTesis);
      if (response.salida) {
        setSelectedPdf(response.contenido);
        setOpenPdfViewer(true);
      } else {
        alert(`Error al cargar el contenido de la tesis: ${response.mensaje}`);
      }
    } catch (error) {
      console.error('Error al abrir PDF:', error);
    }
  };

  return (
    <PageContainer>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#002855', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Biblioteca de Tesis
      </Typography>

      <StyledButton
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 4 }}
      >
        Agregar Tesis
      </StyledButton>

      <Grid container spacing={3}>
  {tesisList
    .filter((tesis) => tesis && tesis.tesis) // Filtrar tesis con estructura válida
    .map((tesis) => (
      <Grid item xs={12} key={tesis.id}>
        <StyledCard>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#002855' }}>{tesis.tesis.titulo}</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Fecha de Publicación: {tesis.tesis.fechaPublicacion}
            </Typography>
            {tesis.estudiante ? (
              <Typography variant="body2" gutterBottom>
                Autor: {tesis.estudiante.nombre}
              </Typography>
            ) : (
              <Typography variant="body2" gutterBottom>
                Autor: No especificado
              </Typography>
            )}
            <Typography variant="body2" gutterBottom>
              Resumen: {tesis.tesis.resumen}
            </Typography>
            <Button
              variant="outlined"
              sx={{ borderColor: '#002855', color: '#002855', mt: 2 }}
              onClick={() => openPdfModal(tesis.tesis.id)}
            >
              Ver Contenido PDF
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              sx={{ mt: 2, color: '#BA0C2F' }}
              onClick={() => handleDelete(tesis.tesis.id)}
            >
              Eliminar
            </Button>
          </CardContent>
        </StyledCard>
      </Grid>
    ))}
</Grid>


      {/* PDF Viewer Dialog */}
      <Dialog open={openPdfViewer} onClose={() => setOpenPdfViewer(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Visualizar Tesis</Typography>
            <IconButton onClick={() => setOpenPdfViewer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedPdf && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
              <Viewer fileUrl={`${selectedPdf}`} />
            </Worker>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Tesis Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
        <DialogContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Agregar Nueva Tesis</Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            label="Título"
            fullWidth
            margin="normal"
            value={nuevoTesis.titulo}
            onChange={(e) => updateField('titulo', e.target.value)}
          />
          <TextField
            label="Fecha de Publicación"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            value={nuevoTesis.fechaPublicacion}
            onChange={(e) => updateField('fechaPublicacion', e.target.value)}
          />
          <TextField
            label="Resumen"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={nuevoTesis.resumen}
            onChange={(e) => updateField('resumen', e.target.value)}
          />
          <Button variant="outlined" component="label" sx={{ mt: 2, color: '#FFD700' }}>
            Subir PDF
            <input type="file" hidden accept="application/pdf" onChange={handlePdfUpload} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#BA0C2F' }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} sx={{ backgroundColor: '#002855', color: '#FFFFFF' }} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default GestionTesis;
