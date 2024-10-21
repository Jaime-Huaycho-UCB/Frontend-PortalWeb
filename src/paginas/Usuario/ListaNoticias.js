import React, { useState } from 'react';
import { Container, Carousel, Modal, Button } from 'react-bootstrap';
import '../../estilos/paginas/ListaNoticias.css';

const noticias = [
  {
    id: 1,
    titulo: 'Nuevo Curso de Programación',
    fecha: '10 Nov 2024',
    descripcion: 'Se ha abierto un nuevo curso de programación avanzada.',
    contenido: 'El curso cubre temas avanzados como estructuras de datos, algoritmos, y optimización.',
    imagen: 'https://sesameworkshop.org/wp-content/uploads/2023/03/presskit_ss_bio_elmo-560x420.png',
  },
  {
    id: 2,
    titulo: 'Actualización de Pensum',
    fecha: '5 Nov 2024',
    descripcion: 'Se ha actualizado el pensum de la carrera de ingeniería.',
    contenido: 'El nuevo pensum incluye materias más actualizadas, en base a las necesidades actuales del mercado laboral.',
    imagen: 'https://sesameworkshop.org/wp-content/uploads/2023/03/presskit_ss_bio_elmo-560x420.png',
  },
];

const ListaNoticias = () => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState(null);

  const handleModalOpen = (noticia) => {
    setSelectedNoticia(noticia);
    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
    setSelectedNoticia(null);
  };

  return (
    <Container className="mt-4 noticias-container">
      <h2 className="titulo-noticias">Lista de Noticias</h2>
      <Carousel>
        {noticias.map((noticia) => (
          <Carousel.Item key={noticia.id} onClick={() => handleModalOpen(noticia)}>
            <img className="d-block w-100" src={noticia.imagen} alt={noticia.titulo} />
            <Carousel.Caption className="noticia-caption">
              <h3>{noticia.titulo}</h3>
              <p>{noticia.descripcion}</p>
              <p><strong>Fecha:</strong> {noticia.fecha}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Modal para mostrar más información de la noticia */}
      <Modal show={modalShow} onHide={handleModalClose}>
        {selectedNoticia && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedNoticia.titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img className="img-fluid mb-3" src={selectedNoticia.imagen} alt={selectedNoticia.titulo} />
              <p><strong>Fecha:</strong> {selectedNoticia.fecha}</p>
              <p>{selectedNoticia.descripcion}</p>
              <p>{selectedNoticia.contenido}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default ListaNoticias;
