import React, { useState, useCallback, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Box, Typography, Dialog, DialogContent, DialogTitle, Button, DialogActions } from '@mui/material';
import { Event, Close } from '@mui/icons-material';
import './ListaEventos.css'; // Incluye el CSS con el estilo skeleton-card
import { obtenerEventos } from '../../../librerias/PeticionesApi'; // Ajusta la ruta según tu archivo de API
import { useNavigate } from 'react-router-dom';

const ListaEventos = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  const cerrarSesion = () => {
    // Lógica para cerrar sesión (debes implementarla según tu proyecto)
  };

  const cargarEventos = useCallback(async () => {
    setLoading(true); // Activa el estado de carga
    try {
      const data = await obtenerEventos();
      if (data.salida) {
        setEventos(data.eventos);
      } else {
        throw new Error('Error al cargar los eventos.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Asegura que el estado de carga se desactive
    }
  }, []);

  useEffect(() => {
    cargarEventos();
  }, [cargarEventos]);

  const handleOpenDialog = (evento) => {
    setEventoSeleccionado(evento);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEventoSeleccionado(null);
    setDialogOpen(false);
  };

  return (
    <Box className="eventos-container" sx={{ mt: 4, px: { xs: 2, sm: 4, md: 6 } }}>
      <Typography variant="h4" align="center" gutterBottom>
        Próximos Eventos
      </Typography>

      {loading ? (
        <VerticalTimeline>
          {Array.from({ length: 4 }).map((_, index) => (
            <VerticalTimelineElement
              key={index}
              contentStyle={{
                background: '#f3f3f3',
                borderRadius: '8px',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
              }}
              iconStyle={{
                background: '#ccc',
                boxShadow: 'none',
              }}
              icon={<div className="skeleton-card2" style={{ borderRadius: '50%', width: '40px', height: '40px' }} />}
            >
              <Box className="skeleton-card2" style={{ height: '150px', borderRadius: '10px' }} />
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      ) : (
        <VerticalTimeline>
          {eventos.map((evento) => (
            <VerticalTimelineElement
              key={evento.id}
              contentStyle={{
                background: '#1b2951',
                color: '#fff',
                borderRadius: '8px',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                cursor: 'pointer',
              }}
              contentArrowStyle={{ borderRight: '7px solid #1b2951' }}
              date={evento.fecha}
              iconStyle={{
                background: '#f39c12',
                color: '#fff',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
              }}
              icon={<Event />}
              onTimelineElementClick={() => handleOpenDialog(evento)} // Se usa para abrir el diálogo
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ flex: 1, paddingRight: '16px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {evento.nombre}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#f39c12' }}>
                    {evento.director}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#f39c12' }}>
                    {evento.lugar}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {evento.fecha}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {evento.descripcion.slice(0, 100)}...
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={evento.fotoBase64}
                    alt={evento.nombre}
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '10px',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                </Box>
              </Box>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      )}

      {eventoSeleccionado && (
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' },
          }}
        >
          <DialogTitle>
            {eventoSeleccionado.nombre}
            <Button
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </Button>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <img
                src={eventoSeleccionado.fotoBase64}
                alt={eventoSeleccionado.nombre}
                style={{ width: '100%', maxHeight: '250px', borderRadius: '8px' }}
              />
            </Box>
            <Typography variant="body1" gutterBottom>
              <strong>Director:</strong> {eventoSeleccionado.director}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Fecha:</strong> {eventoSeleccionado.fecha}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Ubicación:</strong> {eventoSeleccionado.lugar}
            </Typography>
            <Typography variant="body2">{eventoSeleccionado.descripcion}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ListaEventos;
