import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import {  obtenerDocentesTodo,obtenerTitulos } from '../../../librerias/PeticionesApi';
import './ListaDocentes.css';
import 'aos/dist/aos.css'; // Importa las animaciones de AOS
import AOS from 'aos';
import { Email, Person, School } from '@mui/icons-material';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Swal from 'sweetalert2';
import { FilterList } from '@mui/icons-material'; 
const ListaDocentes = () => {
  const [loading, setLoading] = useState(true);
  const [docentes, setDocentes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [titulos, setTitulos] = useState([]);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState(0);
  const cargarDocentes = async (filtroId) => {
    try {
      setLoading(true); // Iniciar carga
      const data = await obtenerDocentesTodo(filtroId); // Llamar a la API
      if (data.salida) {
        setDocentes(data.docentes); // Guardar los datos en el estado
      }else{
        setDocentes([]);
        Swal.fire({
          title: '<strong>¡Sin Resultados Encontrados!</strong>',
          html: `
            <p style="font-size: 1.2rem; color: #666;">
              Lamentablemente, no hay docentes disponibles con el título seleccionado. 
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
      const titulos = await obtenerTitulos();
      setTitulos(titulos || []);
    } catch (error) {
      console.error("Error al cargar docentes:", error);
    } finally {
      setLoading(false); // Finalizar carga
    }
  };

  useEffect(() => {
    cargarDocentes(0);
  }, []);
  const handleShowModal = (docente) => {
    setSelectedDocente(docente);
    setShowModal(true);
    setLoading(true); // Activar el estado de carga
    setTimeout(() => {
      setLoading(false); // Simular carga completada después de 1s
    }, 1000); // Duración del efecto de carga
  };
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseModal = () => {
    setIsClosing(true); // Activar la animación de salida
    setTimeout(() => {
      setShowModal(false); // Cerrar el modal después de la animación
      setIsClosing(false); // Resetear el estado
    }, 300); // Duración de la animación
  };
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Inicializa las animaciones de AOS
  }, []);


  const [showImageModal, setShowImageModal] = useState(false); // Controlar el modal de imagen
  const [selectedImage, setSelectedImage] = useState(""); // Imagen seleccionada

  const handleImageClick = (image) => {
    setSelectedImage(image); // Configurar la imagen seleccionada
    setShowImageModal(true); // Mostrar el modal
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false); // Cerrar el modal
  };
  return (
    <div className="docentes-container">
    {/* Encabezado */}
    <header className="docente-header">
  {/* Carrusel de Fondo */}
  <div className="header-carousel">
    <div className="carousel-slide" style={{ backgroundImage: "url(/Mision.jpg)" }}></div>
    <div className="carousel-slide" style={{ backgroundImage: "url(/Mision2.jpg)" }}></div>
    <div className="carousel-slide" style={{ backgroundImage: "url(/Vision.jpg)" }}></div>
  </div>

  {/* Contenido del Header */}
  <div className="header-content">
    <h2 className="titulo3" data-aos="fade-down">
      Conoce a Nuestros Docentes
    </h2>
    <p className="docente-description" data-aos="fade-up">
      Profesionales dedicados a formar líderes con excelencia académica.
    </p>
  </div>
</header>

    

    {/* Grid de Docentes */}
    <div>
      {/* Título de la sección */}
      <Typography variant="h4" align="center" gutterBottom>
        Filtrar Docentes
      </Typography>

      {/* Contenedor del filtro */}
      <div className="filtro-docentes-container">
        <FormControl fullWidth className="filtro-form-control">
          <div className="filtro-header">
            <FilterList className="filtro-icon" />
            <InputLabel className="filtro-label">Filtrar</InputLabel>
          </div>
          <Select
            value={filtroSeleccionado}
            onChange={(e) => {
              const filtroId = e.target.value;
              setFiltroSeleccionado(filtroId);
              cargarDocentes(filtroId); // Actualiza los docentes según el filtro seleccionado
            }}
            className="filtro-select"
          >
            <MenuItem value={0} className="filtro-menu-item">
              Obtener Todo
            </MenuItem>
            {titulos.map((titulo) => (
              <MenuItem
                key={titulo.id}
                value={titulo.id}
                className="filtro-menu-item"
              >
                {titulo.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Grid de docentes */}
      <section className="docentes-grid">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="skeleton-card99"></div>
              ))
          : docentes.map((docente, index) => (
              <article
                key={docente.id}
                className="docente-card"
                style={{ "--animation-order": index }}
                data-aos="fade-up"
              >
                <figure className="card-image-section">
                  <img
                    src={docente.foto || "/ruta/a/imagen-placeholder.jpg"}
                    alt={docente.nombre}
                    className="docente-image"
                  />
                </figure>
                <div className="card-text-section">
                  <h4 className="docente-nombre">{docente.nombre}</h4>
                  <p className="docente-titulo">{docente.titulo}</p>
                  <p className="docente-correo">
                    <Email fontSize="small" /> {docente.correo}
                  </p>
                  <button
                    className="btn-ver-mas"
                    onClick={() => handleShowModal(docente)}
                  >
                    Ver más
                  </button>
                </div>
              </article>
            ))}
      </section>
    </div>
    {/* Modal de Detalles */}
    {selectedDocente && (
 <Modal
 show={showModal}
 onHide={handleCloseModal}
 centered
 className={`docente-modal ${isClosing ? "closing" : ""}`}
>
 <Modal.Header closeButton>
   <Modal.Title className="modal-title">
     {loading ? "Cargando..." : selectedDocente?.nombre}
   </Modal.Title>
 </Modal.Header>
 <Modal.Body>
   {loading ? (
     <div className="loader-container">
       <div className="spinner"></div>
     </div>
   ) : (
     <div className="modal-content-container">
       <div className="modal-image-wrapper">
       <img
            src={selectedDocente.foto || "/ruta/a/imagen-placeholder.jpg"}
            alt={selectedDocente.nombre}
            className="modal-image"
            
          />
           <button
            className="btn-ver-foto"
            onClick={() => handleImageClick(selectedDocente.foto)}
          >
            Ver Foto
          </button>
       </div>
       <h5 className="modal-subtitle">
         <School fontSize="small" /> {selectedDocente?.titulo}
       </h5>
       <p className="modal-contact">
         <Email fontSize="small" /> {selectedDocente?.correo}
       </p>
       <p className="modal-description">
         <strong>Descripción:</strong>{" "}
         {selectedDocente?.frase || "Sin descripción disponible"}
       </p>
     </div>
   )}
 </Modal.Body>
 <Modal.Footer>
   <button className="btn-cerrar" onClick={handleCloseModal}>
     Cerrar
   </button>
 </Modal.Footer>
</Modal>
)}
{/* Modal de Imagen Completa */}
  {/* Modal de Imagen Completa con Zoom */}
  <Modal
        show={showImageModal}
        onHide={handleCloseImageModal}
        centered
        className="image-modal"
      >
        <Modal.Body>
          <div className="image-modal-content">
            <img
              src={selectedImage || "/ruta/a/imagen-placeholder.jpg"}
              alt="Foto del Docente"
              className="zoomable-image"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-cerrar" onClick={handleCloseImageModal}>
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
  </div>
  );
};

export default ListaDocentes;
