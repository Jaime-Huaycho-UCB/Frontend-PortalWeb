import React, { useState, useEffect ,useRef} from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  IconButton,Tab,Tabs,
  Grid,Paper,
  Accordion,AccordionDetails,AccordionSummary
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './inicio.css';
import { Bar } from 'react-chartjs-2'; // Para gráficos
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';



const Inicio = () => {
  // Carrusel: Manejo de imágenes
  const Carrusel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Cambia cada 3 segundos
      return () => clearInterval(interval);
    }, [images.length]);

    return (
      <div className="carousel-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            className={`carousel-image ${
              index === currentIndex ? "active" : ""
            }`}
          />
        ))}
      </div>
    );
  };

  // Imágenes para las tarjetas
 
  const collageImages = [
    { src: "/Mision.jpg", style: { width: "250px", height: "300px" , top: "50px", left: "40px" } },
    { src: "/Mision2.jpg", style: { width: "200px", height: "150px" ,top: "250px", left: "190px" } },
    { src: "/Proposito.jpg", style: {width: "220px", height: "250px" , top: "165px", left: "-55px" } },
    { src: "/Vision.jpg", style: { width: "130px", height: "140px" ,top: "100px", left: "-100px" } },
    { src: "/Vision1.jpg", style: { width: "200px", height: "150px" ,top: "380px", left: "190px" } },
    { src: "/Vision2.jpg", style: { width: "230px", height: "150px" ,top: "360px", left: "-140px" } },
  ];
  const mosaics = [
    { title: 'Áreas de Desempeño', image: '/Mision.jpg', description: 'Diplomacia, Consultoría, Gestión Pública.' },
    { title: 'Beneficios', image: '/objetivo.jpg', description: 'Convenios internacionales, investigación.' },
    { title: 'Habilidades Clave', image: '/Proposito.jpg', description: 'Resolución de conflictos, negociación.' },
    { title: 'Tendencias', image: '/Vision.jpg', description: 'Demanda en relaciones internacionales.' },
    
  ];
 const images1 = ['/Proposito.jpg', '/cop.jpg', '/Mision.jpg'];
  const images2 = ['/Mision.jpg', '/fondo.jpg', '/Mision2.jpg'];
  const images3 = ['/Vision1.jpg', '/Vision.jpg', '/Vision2.jpg'];

  useEffect(() => {
    const observer1 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.5 } // Activar cuando el 50% de la carta sea visible
    );

    const elements = document.querySelectorAll('.card');
    elements.forEach((el) => observer1.observe(el));

    return () => {
      elements.forEach((el) => observer1.unobserve(el));
    };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio) { // Elemento completamente visible
            entry.target.classList.add('visible-section');
          } else {
            entry.target.classList.remove('visible-section'); // Opcional, si quieres que desaparezca al salir
          }
        });
      },
      {
        threshold: 0.5, // 100% del elemento debe estar visible
      }
    );

    const elements = document.querySelectorAll('.animate-item'); // Selecciona los elementos con esta clase
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  return (
    <div className='wrapper'>
    <Container className="container">
    {/* Pantalla de Bienvenida */}
    <div id='welcome-section1' className="welcome-section">
  <video className="background-video" autoPlay loop muted>
    <source src="/UCB3.mp4" type="video/mp4" />
    Tu navegador no soporta videos.
  </video>

  <div className="welcome-content">
    <div className="text-content">
      <Typography variant="h6" className="subtitle">
        A tu alcance
      </Typography>
      <Typography variant="h2" className="title">
        Ciencias Políticas y <br /> Relaciones Internacionales
      </Typography>
      <Typography variant="body1" className="description">
        "Formando líderes con visión global y compromiso social."
      </Typography>
      <Button className="btn-explore">Explorar Más</Button>
    </div>

    <div className="image-content">
      <img
        src="/CPO - V.png"
        alt="CPO UCB"
        className="welcome-image"
      />
    </div>
  </div>
</div>
<div id="purpose-section" className="purpose-section">
      {/* Encabezado */}
      <div className="purpose-header">
        <h4 id="purpose-title" className="purpose-title">
          Nuestra Esencia
        </h4>
        <p className="purpose-subtitle">
          Descubre los valores que definen nuestra carrera
        </p>
      </div>

      {/* Tarjetas */}
      <div className="purpose-cards">
        {/* Carta 1 */}
        <div className="purpose-card animate-item">
          <div className="carousel-container">
            <Carrusel images={images1} />
          </div>
          <div className="card-content">
            <div className="icon-circle">🎯</div>
            <h5 className="card-title">Propósito</h5>
            <p className="card-description">
              La Carrera tiene como propósito formar profesionales con
              liderazgo, innovación, sensibilidad social y compromiso ético.
            </p>
          </div>
        </div>

        {/* Carta 2 */}
        <div className="purpose-card animate-item">
          <div className="carousel-container">
            <Carrusel images={images2} />
          </div>
          <div className="card-content">
            <div className="icon-circle">🎓</div>
            <h5 className="card-title">Misión</h5>
            <p className="card-description">
              Formar profesionales competitivos en Ciencias Políticas y
              Relaciones Internacionales con una visión integral y ética.
            </p>
          </div>
        </div>

        {/* Carta 3 */}
        <div className="purpose-card animate-item">
          <div className="carousel-container">
            <Carrusel images={images3} />
          </div>
          <div className="card-content">
            <div className="icon-circle">🌎</div>
            <h5 className="card-title">Visión</h5>
            <p className="card-description">
              Inspirar a los profesionales en Ciencias Políticas y Relaciones
              Internacionales para liderar el cambio global.
            </p>
          </div>
        </div>
      </div>
    </div>

<div className="section-container">
  {/* Título de la sección */}
  <div className="section-header">
    <h4 className="section-title">¿Qué te ofrecemos?</h4>
  </div>

  {/* Contenedor de tarjetas */}
  <div className="cards-container">
    {/* Carta 1 */}
    <div className="card animate-item">
      <div
        className="card-background"
        style={{ backgroundImage: "url(/Vision2.jpg)" }}
      ></div>
      <img src="/Calen.gif" alt="Icono Carta 1" className="card-icon" />
      <div className="card-content">
        <h6 className="card-title">Duración y Créditos</h6>
        <ul className="card-list">
          <li>
            <CheckCircleIcon className="check-icon" />
            Duración: 9 semestres
          </li>
          <li>
            <CheckCircleIcon className="check-icon" />
            Créditos totales: 284 créditos
          </li>
          <li>
            <CheckCircleIcon className="check-icon" />
            Horas académicas: 4,500 horas
          </li>
        </ul>
      </div>
    </div>

    {/* Carta 2 */}
    <div className="card animate-item">
      <div
        className="card-background"
        style={{ backgroundImage: "url(/cop.jpg)" }}
      ></div>
      <img src="/alumno.gif" alt="Icono Carta 2" className="card-icon" />
      <div className="card-content">
        <h6 className="card-title">Modalidad de Graduación</h6>
        <ul className="card-list">
          <li>
            <CheckCircleIcon className="check-icon" />
            Tesis de Grado
          </li>
          <li>
            <CheckCircleIcon className="check-icon" />
            Graduación por Excelencia
          </li>
        </ul>
      </div>
    </div>

    {/* Carta 3 */}
    <div className="card animate-item">
      <div
        className="card-background"
        style={{ backgroundImage: "url(/Proposito.jpg)" }}
      ></div>
      <img src="/libro.gif" alt="Icono Carta 3" className="card-icon" />
      <div className="card-content">
        <h6 className="card-title">Áreas de Estudio</h6>
        <ul className="card-list">
          <li>
            <CheckCircleIcon className="check-icon" />
            Historia Política
          </li>
          <li>
            <CheckCircleIcon className="check-icon" />
            Teoría y Análisis Políticos
          </li>
          <li>
            <CheckCircleIcon className="check-icon" />
            Relaciones Internacionales
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div className="layout-container">
  {/* Contenedor Principal */}
  <div className="layout-content">
    {/* Contenedor del Título, Subtítulo y Video */}
    <div className="video-section">
      {/* Cabecera */}
      <div className="header">
        <Typography variant="h3" className="title1">
          Descubre tu Futuro en Ciencias Políticas
        </Typography>
        <Typography variant="subtitle" className="subtitle1">
          "Forma parte de una comunidad que inspira el cambio, lidera el progreso y conecta con el mundo."
        </Typography>
      </div>

      {/* Video */}
      <div className="video-container">
        <Typography className="video-text">
          "Inspirando a futuros líderes políticos."
        </Typography>
        <video className="video" autoPlay loop muted>
          <source src="/UCB3.mp4" type="video/mp4" />
          Tu navegador no soporta videos.
        </video>
      </div>
    </div>

    {/* Contenedor del Mosaico */}
    <div className="mosaic-section">
      <div className="mosaic-grid">
        {mosaics.map((mosaic, index) => (
          <div className="mosaic-item" key={index}>
            <div
              className="mosaic-background"
              style={{ backgroundImage: `url(${mosaic.image})` }}
            ></div>
            <Typography className="mosaic-title">{mosaic.title}</Typography>
            <div className="mosaic-hover">
              <Typography className="mosaic-description">
                {mosaic.description}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
<div className="history-container">
  {/* Texto Izquierdo */}
  <div className="history-text">
    <div className="history-header">
      <span className="overline">Historia de la Carrera</span>
      <h4 className="history-title">Un Legado de Excelencia Académica</h4>
    </div>
    <div className="history-paragraphs">
      <p>
        La carrera de Ciencias Políticas y Relaciones Internacionales tiene una rica historia. Su enfoque está en formar líderes éticos y humanistas, capaces de transformar el panorama político y social, con un compromiso firme hacia la excelencia académica y el impacto global.
      </p>
      <p>
        A lo largo de los años, esta carrera se ha distinguido por su enfoque en las relaciones internacionales y la gobernanza, integrando conocimientos teóricos y prácticos que preparan a los estudiantes para desafíos globales.
      </p>
    </div>
  </div>

  {/* Collage al lado derecho */}
  <div className="history-collage">
    {collageImages.map((image, index) => (
      <div
        key={index}
        className="collage-item"
        style={{ backgroundImage: `url(${image.src})` }}
      >
        <div className="collage-tape"></div>
      </div>
    ))}
  </div>
</div>


    </Container>
    </div>
  );
};

export default Inicio;
