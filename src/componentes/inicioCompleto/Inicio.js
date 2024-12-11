import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  IconButton,
  Tab,
  Tabs,
  Grid,
  Paper,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './inicio.css';
import { Bar } from 'react-chartjs-2'; // Para gráficos
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css'; // Estilo base de Swiper
import 'swiper/css/navigation'; // Si usas navegación
import 'swiper/css/pagination'; // Si usas paginación
import 'swiper/css/effect-fade'; // Si usas el efecto fade
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

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
    <Container className="container4">
    {/* Pantalla de Bienvenida */}
    <div id="welcome-section1" className="welcome-section">
    
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }} // Configuración de autoplay
        effect="fade" // Transición con fade
        navigation={true} // Botones de navegación
        pagination={{ clickable: true }} // Paginación en puntos
        loop={true} // Habilita el looping infinito
        className="swiper-container"
      >
        {/* Diapositivas del carrusel */}
        <SwiperSlide>
          <img src="/Mision.jpg" alt="Imagen 1" className="swiper-slide-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/Mision2.jpg" alt="Imagen 2" className="swiper-slide-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/Proposito.jpg" alt="Imagen 3" className="swiper-slide-image" />
        </SwiperSlide>
      </Swiper>

      <div className="welcome-content0">
    <div className="text-content0">
      <h2 className="title0">Ciencias Políticas y Relaciones Internacionales</h2>
      <p className="description0">"Formando líderes con visión global y compromiso social."</p>
      <button
  className="btn-explore0"
  onClick={() => document.getElementById('ciencista').scrollIntoView({ behavior: 'smooth' })}
>
  Explorar Más
</button>

    </div>
  </div>
    </div>

    <div  id='ciencista'  class="layoutCiencista">
  <div class="videoCiencista">
  <iframe 
      width="100%" 
      height="100%" 
      src="https://www.youtube.com/embed/IkAJicIjGx8" 
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>

  <div class="textCiencista">
    <h2 class="titleCiencista">¿Qué significa ser un cientista político?</h2>
    <p class="descriptionCiencista">
      Ser un cientista político significa formar parte de una disciplina apasionante que analiza cómo se organiza el poder y se ejerce el gobierno en las sociedades, abarcando tanto el ámbito local como el internacional. Un cientista político es un líder con una sólida vocación pública, preparado para estudiar y comprender los complejos procesos políticos, sociales y económicos que afectan a las comunidades. Estos profesionales destacan por su capacidad para tomar decisiones estratégicas, diseñar políticas públicas innovadoras y aportar soluciones prácticas a los desafíos que enfrentan las sociedades contemporáneas. Si tu meta es influir en el futuro de tu país, comprender las dinámicas globales y contribuir al cambio social desde una perspectiva analítica y propositiva, la Ciencia Política es el camino ideal para convertirte en un cientista político comprometido con el progreso.
    </p>
  </div>
</div>


<div className="history-container">
  
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
          <div className="card-content000">
            <div className="icon-circle000">🎯</div>
            <h5 className="card-title000">Propósito</h5>
            <p className="card-description000">
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
          <div className="card-content000">
            <div className="icon-circle000">🎓</div>
            <h5 className="card-title000">Misión</h5>
            <p className="card-description000">
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
          <div className="card-content000">
            <div className="icon-circle000">🌎</div>
            <h5 className="card-title000">Visión</h5>
            <p className="card-description000">
              Inspirar a los profesionales en Ciencias Políticas y Relaciones
              Internacionales para liderar el cambio global.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="section-container111">
  {/* Título de la sección */}
  <div className="section-header111">
    <h4 className="section-title111">¿Qué te ofrecemos?</h4>
  </div>

  {/* Contenedor de tarjetas */}
  <div className="cards-container111">
    {/* Carta 1 */}
    <div className="card111 flip-card111">
      <div className="flip-card-inner111">
        <div className="flip-card-front111">
          <img src="/Calen.gif" alt="Icono Carta 1" className="card-icon-front111" />
          <h6 className="card-title-front111">Duración y Créditos</h6>
        </div>
        <div className="flip-card-back111">
          <div className="card-background111" style={{ backgroundImage: "url(/Vision2.jpg)" }}></div>
          <div className="card-back-content111">
            <img src="/Calen.gif" alt="Logo" className="card-icon-back111" />
            <h6 className="card-title-back111">Duración y Créditos</h6>
            <ul className="card-list111">
              <li>Duración: 9 semestres</li>
              <li>Créditos totales: 284 créditos</li>
              <li>Horas académicas: 4,500 horas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    {/* Carta 2 */}
    <div className="card111 flip-card111">
      <div className="flip-card-inner111">
        <div className="flip-card-front111">
          <img src="/alumno.gif" alt="Icono Carta 2" className="card-icon-front111" />
          <h6 className="card-title-front111">Modalidad de Graduación</h6>
        </div>
        <div className="flip-card-back111">
          <div className="card-background111" style={{ backgroundImage: "url(/cop.jpg)" }}></div>
          <div className="card-back-content111">
            <img src="/alumno.gif" alt="Logo" className="card-icon-back111" />
            <h6 className="card-title-back111">Modalidad de Graduación</h6>
            <ul className="card-list111">
              <li>Tesis de Grado</li>
              <li>Graduación por Excelencia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    {/* Carta 3 */}
    <div className="card111 flip-card111">
      <div className="flip-card-inner111">
        <div className="flip-card-front111">
          <img src="/libro.gif" alt="Icono Carta 3" className="card-icon-front111" />
          <h6 className="card-title-front111">Áreas de Estudio</h6>
        </div>
        <div className="flip-card-back111">
          <div className="card-background111" style={{ backgroundImage: "url(/Proposito.jpg)" }}></div>
          <div className="card-back-content111">
            <img src="/libro.gif" alt="Logo" className="card-icon-back111" />
            <h6 className="card-title-back111">Áreas de Estudio</h6>
            <ul className="card-list111">
              <li>Historia Política</li>
              <li>Teoría y Análisis Políticos</li>
              <li>Relaciones Internacionales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div className="layout-container33">
  {/* Sección Principal */}
  <div className="layout-content33">
    {/* Título, Subtítulo y Video */}
    <div className="video-section33">
      <div className="header33">
        <Typography variant="h3" className="title33">
          Descubre tu Futuro en Ciencias Políticas
        </Typography>
        <Typography variant="subtitle1" className="subtitle33">
          "Forma parte de una comunidad que inspira el cambio, lidera el progreso y conecta con el mundo."
        </Typography>
      </div>
      <div className="video-container33">
        <video className="video33" autoPlay loop muted>
          <source src="/UCB3.mp4" type="video/mp4" />
          Tu navegador no soporta videos.
        </video>
        <button className="btn-explore33">Explorar Más</button>
      </div>
    </div>

    {/* Tarjetas Interactivas */}
    <div className="interactive-cards-section33">
      <Typography variant="h4" className="section-title33">
        Nuestras Áreas de Impacto
      </Typography>
      <div className="interactive-cards-container33">
        {mosaics.map((mosaic, index) => (
          <div className="interactive-card33" key={index}>
            <div
              className="interactive-card-background33"
              style={{ backgroundImage: `url(${mosaic.image})` }}
            ></div>
            <div className="interactive-card-content33">
           
              <Typography className="interactive-card-title33">{mosaic.title}</Typography>
              <Typography className="interactive-card-description33">{mosaic.description}</Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>




    </Container>
    </div>
  );
};

export default Inicio;
