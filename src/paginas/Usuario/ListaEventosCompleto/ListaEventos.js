import React, { useState, useEffect, useCallback } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import es from 'date-fns/locale/es'; // Soporte para español
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  List,
  ListItem,
} from '@mui/material';
import { Event, Close } from '@mui/icons-material';
import './ListaEventos.css';
import { obtenerEventos } from '../../../librerias/PeticionesApi';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ListaEventos = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventosDia, setEventosDia] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarEventos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerEventos();
      if (data.salida) {
        setEventos(
          data.eventos.map((evento) => ({
            id: evento.id,
            title: evento.nombre,
            start: new Date(evento.fecha),
            end: new Date(evento.fecha), // Fecha única para cada evento
            resource: evento, // Incluye todos los datos del evento
          }))
        );
      } else {
        throw new Error('Error al cargar los eventos.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEventos();
  }, [cargarEventos]);

  const handleSelectDay = (events) => {
    setEventosDia(events.map((e) => e.resource)); // Extraemos los datos del evento
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEventosDia([]);
    setDialogOpen(false);
  };

  return (
    <Box className="eventos-container" sx={{ mt: 4, px: { xs: 2, sm: 4, md: 6 } }}>
      <Typography variant="h4" align="center" gutterBottom>
        Calendario de Eventos
      </Typography>

      {/* Calendario Interactivo */}
      <Box sx={{ height: 500, marginBottom: 4 }}>
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', borderRadius: '8px', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)' }}
          popup
          messages={{
            next: 'Siguiente',
            previous: 'Anterior',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            noEventsInRange: 'No hay eventos en este rango.',
          }}
          onSelectEvent={(event) => handleSelectDay([event])}
          onSelectSlot={(slotInfo) => {
            const eventsForDay = eventos.filter(
              (event) =>
                event.start.toDateString() === new Date(slotInfo.start).toDateString()
            );
            if (eventsForDay.length > 0) {
              handleSelectDay(eventsForDay);
            }
          }}
          selectable
        />
      </Box>

      <Typography variant="h5" align="center" gutterBottom>
        Línea de Tiempo de Eventos
      </Typography>

      {/* Línea de Tiempo */}
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
              }}
              contentArrowStyle={{ borderRight: '7px solid #1b2951' }}
              date={evento.start.toLocaleDateString()}
              iconStyle={{
                background: '#f39c12',
                color: '#fff',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
              }}
              icon={<Event />}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {evento.title}
              </Typography>
              <Typography variant="body2">{evento.resource.descripcion}</Typography>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      )}

      {/* Modal de Eventos */}
      {dialogOpen && (
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
            Eventos del Día
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
            <List>
              {eventosDia.map((evento) => (
                <ListItem key={evento.id} sx={{ mb: 2 }}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="h6">{evento.nombre}</Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Descripción:</strong> {evento.descripcion}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Director:</strong> {evento.director}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Fecha:</strong> {evento.fecha}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Lugar:</strong> {evento.lugar}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
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
