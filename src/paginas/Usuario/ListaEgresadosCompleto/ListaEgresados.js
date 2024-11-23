import React, { useState, useEffect } from "react";
import {
  Modal,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Fade,
} from "@mui/material";
import { Email, School, Info } from "@mui/icons-material";
import { obtenerEstudiantes, obtenerNivelesAcademicos } from "../../../librerias/PeticionesApi";
import "./ListaEgresados.css";
import "aos/dist/aos.css"; // Animaciones de AOS
import AOS from "aos";

const ListaEgresados = () => {
  const [egresados, setEgresados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEgresado, setSelectedEgresado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([obtenerEstudiantes(), obtenerNivelesAcademicos()])
      .then(([dataEstudiantes]) => {
        if (dataEstudiantes.salida) {
          setEgresados(dataEstudiantes.estudiantes || []);
        }
      })
      .catch((error) => console.error("Error al cargar datos:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleShowModal = (egresado) => {
    setSelectedEgresado(egresado);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEgresado(null);
  };

  return (
    <Container maxWidth="lg" className="egresados-container2">
      {/* Encabezado */}
      <Fade in timeout={1000}>
        <Typography variant="h3" className="titulo-principal2">
          Nuestros Egresados
        </Typography>
      </Fade>
      <Fade in timeout={1200}>
        <Typography variant="body1" className="descripcion-principal2">
          Conoce a nuestros estudiantes destacados, transformando aprendizaje en impacto global.
        </Typography>
      </Fade>

      {/* Grid de Egresados */}
      <Grid container spacing={4} className="grid-egresados2">
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} className="skeleton-card">
                <div className="skeleton"></div>
              </Grid>
            ))
        ) : (
          egresados.map((egresado) => (
            <Grid item xs={12} sm={6} md={4} key={egresado.id} data-aos="fade-up">
              <Card className="egresado-card2">
                <CardMedia
                  component="img"
                  height="180"
                  image={egresado.foto || "https://cdn-icons-png.freepik.com/256/2307/2307607.png"}
                  alt={egresado.nombre}
                  className="egresado-image2"
                  loading="lazy"
                />
                <CardContent className="egresado-content2">
                  <Typography variant="h5" className="egresado-nombre2">
                    {egresado.nombre}
                  </Typography>
                  <Typography variant="body2" className="egresado-titulo2">
                    <School fontSize="small" /> {egresado.nivelAcademico}
                  </Typography>
                  <Typography variant="body2" className="egresado-email2">
                    <Email fontSize="small" /> {egresado.correo}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    className="btn-ver-mas2"
                    startIcon={<Info />}
                    onClick={() => handleShowModal(egresado)}
                  >
                    Ver más
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Modal Detallado */}
      {selectedEgresado && (
        <Modal open={showModal} onClose={handleCloseModal}>
          <Fade in>
            <Box className="modal-box2">
              <Typography variant="h4" className="modal-titulo2">
                {selectedEgresado.nombre}
              </Typography>
              <img
                src={selectedEgresado.foto || "https://cdn-icons-png.freepik.com/256/2307/2307607.png"}
                alt={selectedEgresado.nombre}
                className="modal-image2"
                loading="lazy"
              />
              <Typography variant="body1" className="modal-texto2">
                <strong>Email:</strong> {selectedEgresado.correo}
              </Typography>
              <Typography variant="body1" className="modal-texto2">
                <strong>Nivel Académico:</strong> {selectedEgresado.nivelAcademico}
              </Typography>
              <Typography variant="body1" className="modal-texto2">
                <strong>Biografía:</strong> {selectedEgresado.tesis || "Sin información adicional."}
              </Typography>
              <Button variant="contained" className="btn-cerrar2" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Box>
          </Fade>
        </Modal>
      )}
    </Container>
  );
};

export default ListaEgresados;
