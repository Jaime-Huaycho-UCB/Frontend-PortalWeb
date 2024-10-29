import React, { useState } from 'react';
import { Button, Form, Modal, Carousel } from 'react-bootstrap';
import '../../estilos/AdministradorEstilos/GestionNoticias.css';

const GestionNoticias = () => {
  const [showModal, setShowModal] = useState(false);
  const [newNoticia, setNewNoticia] = useState({ titulo: '', fecha: '', descripcion: '', imagen: null });
  const [noticias, setNoticias] = useState([
    { id: 1, titulo: 'Nuevo Plan de Estudios', fecha: '5 Nov 2024', descripcion: 'Se ha lanzado un nuevo plan de estudios para Ciencias Políticas.', imagen: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/4ef8/live/970bbd30-c0fa-11ee-897d-3950f2e7afa7.jpg.webp' },
    { id: 2, titulo: 'Conferencia Internacional', fecha: '10 Nov 2024', descripcion: 'Se realizará una conferencia internacional sobre política global.', imagen: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/4ef8/live/970bbd30-c0fa-11ee-897d-3950f2e7afa7.jpg.webp' },
  ]);

  const manejarCambioFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewNoticia({ ...newNoticia, imagen: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNoticia = () => {
    setNoticias([...noticias, { ...newNoticia, id: noticias.length + 1 }]);
    setNewNoticia({ titulo: '', fecha: '', descripcion: '', imagen: null });
    setShowModal(false);
  };

  return (
    <div className="gestion-noticias-container">
      <div className="header">
        <h2>Gestión de Noticias</h2>
        <Button variant="primary" onClick={() => setShowModal(true)} className="add-noticia-btn">Agregar Noticia</Button>
      </div>

      {/* Carrusel de noticias */}
      <Carousel className="noticias-carousel">
        {noticias.map((noticia) => (
          <Carousel.Item key={noticia.id}>
            <img
              className="d-block w-100 noticia-img"
              src={noticia.imagen || '/ruta/a/foto-placeholder.jpg'}
              alt={noticia.titulo}
            />
            <Carousel.Caption>
              <h3>{noticia.titulo}</h3>
              <p>{noticia.descripcion}</p>
              <small>Fecha: {noticia.fecha}</small>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Modal para agregar noticias */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Noticia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitulo">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el título de la noticia"
                value={newNoticia.titulo}
                onChange={(e) => setNewNoticia({ ...newNoticia, titulo: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFecha" className="mt-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={newNoticia.fecha}
                onChange={(e) => setNewNoticia({ ...newNoticia, fecha: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion" className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe la noticia"
                value={newNoticia.descripcion}
                onChange={(e) => setNewNoticia({ ...newNoticia, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formImagen" className="mt-3">
              <Form.Label>Imagen del Noticia</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={manejarCambioFoto}
              />
              {newNoticia.imagen && (
                <div className="vista-previa mt-3">
                  <img src={newNoticia.imagen} alt="Vista previa" className="foto-previa" />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleAddNoticia}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionNoticias;
