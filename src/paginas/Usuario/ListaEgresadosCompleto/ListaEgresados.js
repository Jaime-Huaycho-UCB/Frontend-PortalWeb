import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Box,
  Button,
} from '@mui/material';
import { Email, School, Event } from '@mui/icons-material';

import { obtenerEstudiantes, obtenerFiltros } from '../../../librerias/PeticionesApi';
import './ListaEgresados.css';
import Swal from 'sweetalert2';
const ListaEgresados = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState([]);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState(0);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = (estudiante) => {
    setSelectedEstudiante(estudiante);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEstudiante(null);
    setOpenModal(false);
  };

  const cargarDatos = async (id) => {
    try {
      setLoading(true);
      const estudiantesResponse = id === 0 
        ? await obtenerEstudiantes(0) // Trae todos los estudiantes
        : await obtenerEstudiantes(id); // Filtra por el ID
      if (estudiantesResponse.salida) {
        setEstudiantes(estudiantesResponse.estudiantes || []);
      } else {
        setEstudiantes([]);
        Swal.fire({
          title: '<strong>¡Sin Resultados Encontrados!</strong>',
          html: `
            <p style="font-size: 1.2rem; color: #666;">
              Lamentablemente, no hay egresesados disponibles con el ano y semestre seleccionado. 
              Por favor, prueba con otro filtro o vuelve a intentarlo más tarde.
            </p>
          `,
          icon: 'info',
          iconColor: '#ffd700', // Icono personalizado en color dorado
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> Entendido',
          confirmButtonColor: '#1b2951', // Botón azul oscuro
          background: '#f8f9fa', // Fondo claro
          color: '#343a40', // Texto principal en gris oscuro
          backdrop: `
            rgba(0,0,123,0.4)
            url("/ruta/a/tu-imagen.gif")
            left top
            no-repeat
          `, // Fondo dinámico con un GIF o imagen
          showClass: {
            popup: 'animate__animated animate__fadeInDown', // Animación de entrada
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp', // Animación de salida
          },
        });
      }
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarFiltros = async () => {
    try {
      const data = await obtenerFiltros();
      if (data.salida) {
        setFiltros(data.semestres || []);
      }
    } catch (error) {
      console.error('Error al cargar filtros:', error);
    }
  };

  useEffect(() => {
    cargarDatos(0); // Cargar todos los estudiantes por defecto
    cargarFiltros(); // Cargar los filtros disponibles
  }, []);

  return (
    <div className="gestion-estudiantes-container5">
     <div
  className="titulo-container3"
  style={{
    backgroundImage: `url('/Mision2.jpg')`, // Ruta relativa desde la carpeta public
  }}
>
  <h2 className="titulo-principal3">Nuestros Egresados</h2>
</div>


      
      {/* Filtro */}
      <Typography variant="h4" align="center" gutterBottom>
        Filtrar Egresados
      </Typography>
      <div className="filtro-estudiantes-container">
      <FormControl fullWidth margin="dense" className="filtro-form-control6">
  <div className="filtro-header">
    <span className="filtro-icon">🔍</span>
    <InputLabel className="filtro-label">Filtrar</InputLabel>
  </div>
  <Select
    value={filtroSeleccionado}
    onChange={(e) => {
      const filtroId = e.target.value;
      setFiltroSeleccionado(filtroId); // Actualiza el filtro seleccionado
      cargarDatos(filtroId); // Llama a cargarDatos con el filtro correspondiente
    }}
    className="filtro-select"
  >
    <MenuItem className="filtro-menu-item" value={0}>
      Obtener Todo
    </MenuItem>
    {filtros.map((filtro) => (
      <MenuItem className="filtro-menu-item" key={filtro.id} value={filtro.id}>
        {filtro.cadena}
      </MenuItem>
    ))}
  </Select>
</FormControl>
</div>


      {/* Grid de estudiantes */}
      <Grid container spacing={5} className="grid-estudiantes5" justifyContent="center">
        {loading
          ? Array(estudiantes.length || 6) // Mostrar placeholders equivalentes al número de estudiantes o 6 por defecto
              .fill(0)
              .map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                  <div className="skeleton-card9"></div> {/* Skeleton por tarjeta */}
                </Grid>
              ))
          : estudiantes.map((estudiante) => (
              <Grid item xs={12} sm={6} md={4} key={estudiante.id}>
                <Card className="card5" onClick={() => handleOpenModal(estudiante)}>
                  <CardMedia
                    component="img"
                    className="card-media5"
                    height="200"
                    image={estudiante.foto || 'https://cdn-icons-png.freepik.com/256/2307/2307607.png'}
                    alt="Foto del Estudiante"
                    style={{ objectFit: 'cover' }}
                  />
                 <CardContent className="card-content5">
  <h3>{estudiante.nombre}</h3>
  <p><Email fontSize="small" /> Correo :{estudiante.correo || 'N/A'}</p>
  <p><School fontSize="small" /> Titulo : {estudiante.nivelAcademico || 'N/A'}</p>
  <p><Event fontSize="small" /> Semestre :{estudiante.semestre || 'N/A'}</p>
</CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          {selectedEstudiante && (
            <>
              <CardMedia
                component="img"
                height="200"
                image={selectedEstudiante.foto || 'https://cdn-icons-png.freepik.com/256/2307/2307607.png'}
                alt={selectedEstudiante.nombre}
                style={{
                  objectFit: 'cover',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  width: '150px',
                  height: '150px',
                }}
              />
              <Typography variant="h5" gutterBottom>
                {selectedEstudiante.nombre}
              </Typography>
              <Typography>Email: {selectedEstudiante.correo || 'N/A'}</Typography>
              <Typography>Nivel Académico: {selectedEstudiante.nivelAcademico || 'N/A'}</Typography>
              <Typography>Semestre: {selectedEstudiante.semestre || 'N/A'}</Typography>
              <Button onClick={handleCloseModal} sx={{ mt: 2 }} variant="contained" color="primary">
                Cerrar
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ListaEgresados;
