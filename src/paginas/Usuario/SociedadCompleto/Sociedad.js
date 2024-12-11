import React, { useState } from 'react';
import { Button, Modal } from '@mui/material';
import './Sociedad.css';
import { Link } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
const Sociedad= () => {
  const [openPodcastModal, setOpenPodcastModal] = useState(false);
  const [openChasquiModal, setOpenChasquiModal] = useState(false);

  return (
    <div
      className="main-page"
      style={{
        backgroundImage: `url('/Mision2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="overlay">
        <h1 className="overlay-title">Sociedad Científica</h1>
      </div>

      <div className="sections-container">
      <div className="section">
  <img src="/Mision.jpg" alt="Esto no es política" className="section-image" />
  <h2 className="section-title">Esto no es Política</h2>
  <p className="section-content">
    "Esto no es política" es el podcast oficial de la Sociedad Científica de Ciencias Políticas y Relaciones Internacionales de la Universidad Católica Boliviana San Pablo. Este espacio está diseñado para fomentar la reflexión crítica, el análisis profundo y el diálogo abierto sobre los temas que, con frecuencia, quedan fuera de las conversaciones cotidianas.
    <br /><br />
    En cada episodio, exploramos una amplia gama de tópicos que abarcan desde las dinámicas sociales y culturales hasta los desafíos globales actuales, siempre con un enfoque académico y humanista. "Esto no es política" no solo busca informar, sino también inspirar, promoviendo el pensamiento crítico y la acción responsable en un mundo en constante cambio.
    <br /><br />
    Acompáñanos mientras cuestionamos lo establecido, desmontamos mitos y abrimos la puerta a nuevas perspectivas. Ya sea que te interese la política, las relaciones internacionales, o simplemente quieras ampliar tu comprensión sobre el mundo que te rodea, este podcast tiene algo para ofrecerte. Porque, al final, el cambio empieza por las ideas que nos atrevemos a compartir.
  </p>
  <Button
    variant="contained"
    color="primary"
    onClick={() => setOpenPodcastModal(true)}
    className="section-button"
  >
    Ver Podcasts
  </Button>
</div>


<div className="section">
  <img src="/Mision2.jpg" alt="Chasqui Postas" className="section-image" />
  <h2 className="section-title">Chasqui Postas</h2>
  <p className="section-content">
    Las Chasqui Postas son publicaciones destacadas realizadas por la carrera de Ciencias Políticas y Relaciones Internacionales de la Universidad Católica Boliviana San Pablo. Estas publicaciones tienen como objetivo compartir reflexiones, investigaciones, y análisis de temas relevantes tanto a nivel nacional como internacional.
    <br /><br />
    A través de estas publicaciones, buscamos promover un espacio de intercambio académico y cultural que fomente el aprendizaje y el entendimiento mutuo. Explora nuestras publicaciones y únete a la conversación sobre los desafíos y oportunidades del mundo actual.
  </p>
  <Button
    variant="contained"
    color="secondary"
    onClick={() => setOpenChasquiModal(true)}
    className="section-button"
  >
    Ir a Chasqui Postas
  </Button>
</div>

<div className="section">
  <img src="/Mision.jpg" alt="Sociedad Científica" className="section-image" />
  <h2 className="section-title">Sociedad Científica</h2>
  <p className="section-content">
    La Sociedad Científica de Ciencias Políticas y Relaciones Internacionales es una plataforma creada para impulsar la investigación, el análisis y la innovación en nuestra área de estudio. 
    <br /><br />
    Nuestros miembros participan activamente en proyectos interdisciplinarios, conferencias, talleres y otras actividades diseñadas para fomentar el pensamiento crítico y la colaboración académica. ¡Únete a nosotros y sé parte del cambio que queremos ver en el mundo!
  </p>
</div>
</div>
      <Modal open={openPodcastModal} onClose={() => setOpenPodcastModal(false)} className="modal-container">
  <div className="modal-content">
    <h2>Esto no es Política - Podcasts</h2>
    <p>
      Los podcasts están disponibles en Spotify. Haz clic en el botón de abajo para escucharlos.
    </p>
    <Button
      variant="contained"
      color="primary"
      onClick={() => window.open('https://open.spotify.com/show/0jmsF7xCezZcFZu4v9ASDH?si=NZ0iTe7OR_uu6XMBRSzRyg&nd=1&dlsi=b3b07dc2cd2248c4')}
      style={{ marginTop: '10px' }}
    >
      Escuchar en Spotify
    </Button>
    <Button
      variant="contained"
      color="secondary"
      onClick={() => setOpenPodcastModal(false)}
      style={{ marginTop: '10px' }}
    >
      Cerrar
    </Button>
  </div>
</Modal>

      {/* Modal para "Chasqui Postas" */}
      <Modal
        open={openChasquiModal}
        onClose={() => setOpenChasquiModal(false)}
        className="modal-container"
      >
        <div className="modal-content">
          <h2>Chasqui Postas</h2>
          <p>Aquí puedes descubrir nuestras publicaciones.</p>
          <Button
                startIcon={<ArticleIcon />}
                className="nav-button1"
                component={Link}
                to="/chasqui"
              >
                Chasqui Postas
              </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenChasquiModal(false)}
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Sociedad;
