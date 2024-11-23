import React, { useState, useEffect, useCallback } from "react";
import "./ListaNoticias.css";
import { Modal, Fade, Button, Typography } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import { obtenerNoticias } from "../../../librerias/PeticionesApi";

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const cargarNoticias = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerNoticias();
      if (data.salida) {
        setNoticias(data.noticias);
      }
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarNoticias();
  }, [cargarNoticias]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
    if (!loading) {
      AOS.refresh(); // Refresca AOS después de cargar
    }
  }, [loading, noticias]);

  const handleShowModal = (noticia) => {
    setSelectedNoticia(noticia);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedNoticia(null);
    setShowModal(false);
  };

  return (
    <div className="noticias-container">
      <header className="noticias-header">
        <h1 className="logo">Noticias Profesionales</h1>
      </header>
      <main className="noticias-lista">
        {loading
          ? Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="skeleton-card">
                </div>
              ))
          : noticias.map((noticia, index) => (
              <div
                key={index}
                className="noticia-fila"
                data-aos="fade-up" // Aplicar animación AOS
              >
                <img
                  src={noticia.fotoNoticia}
                  alt={noticia.titulo}
                  className="noticia-imagen"
                />
                <div className="noticia-detalle">
                  <Typography variant="h6">{noticia.titulo}</Typography>
                  <Typography variant="body2">{noticia.resumen}</Typography>
                  <Button size="small" variant="outlined"  onClick={() => handleShowModal(noticia)}>
                    Leer Más
                  </Button>
                </div>
              </div>
            ))}
      </main>

      {/* Modal para Noticia Completa */}
      {selectedNoticia && (
        <Modal open={showModal} onClose={handleCloseModal}>
          <Fade in>
            <div className="modal-box">
              <Typography variant="h4" className="modal-titulo">
                {selectedNoticia.titulo}
              </Typography>
              <img
                src={selectedNoticia.fotoNoticia}
                alt={selectedNoticia.titulo}
                className="modal-imagen"
              />
              <Typography variant="body1" className="modal-fecha">
                Fecha de Publicación: {selectedNoticia.fechaPublicacion}
              </Typography>
              <Typography variant="body1" className="modal-redactor">
                Redactor: {selectedNoticia.redactor}
              </Typography>
              <Typography variant="body1" className="modal-categoria">
                Categoría: {selectedNoticia.categoria}
              </Typography>
              <Typography variant="body2" className="modal-contenido">
                {selectedNoticia.noticia}
              </Typography>
              <Button variant="contained" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </div>
          </Fade>
        </Modal>
      )}
    </div>
  );
};

export default Noticias;
