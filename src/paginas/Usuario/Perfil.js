import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { AuthContext } from '../../contextos/ContextoAutenticacion';
import { obtenerPerfil, obtenerPapers, agregarPaper } from '../../librerias/PeticionesApi';

const Perfil = () => {
  const { idDocente, idUsuario, token, cerrarSesion } = useContext(AuthContext);
  const [docente, setDocente] = useState(null);
  const [papers, setPapers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPaper, setNewPaper] = useState({
    titulo: '',
    link: '',
  });

  // Función para cargar papers
  const cargarPapers = async () => {
    try {
      const papersData = await obtenerPapers(idDocente);
      if (papersData.salida && papersData.papers) {
        setPapers(papersData.papers.filter(paper => paper && paper.titulo && paper.link));
      }
    } catch (error) {
      console.error("Error al obtener los papers:", error);
    }
  };

  useEffect(() => {
    const cargarDocente = async () => {
      try {
        const datosDocente = await obtenerPerfil(idDocente, idUsuario, token);
        setDocente(datosDocente.informacion);
      } catch (error) {
        console.error("Error al cargar el perfil del docente:", error);
      }
    };

    cargarDocente();
    cargarPapers(); // Carga inicial de papers
  }, [idDocente, idUsuario, token,cargarPapers]);

  const handleAddPaper = async () => {
    const paperData = {
      titulo: newPaper.titulo,
      link: newPaper.link,
    };

    try {
      const response = await agregarPaper(paperData, idDocente, idUsuario, token);
      if (response.salida) {
        setNewPaper({ titulo: '', link: '' });
        setShowModal(false);
        alert("Paper añadido exitosamente");
        
        // Vuelve a cargar la lista de papers desde el backend
        cargarPapers();
      } else {
        if (response.mensaje === 'TKIN') {
          cerrarSesion();
          navigate('/iniciar-sesion');
        } else {
          console.error(response.mensaje);
        }
      }
    } catch (error) {
      console.error("Error al agregar el paper:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPaper({ ...newPaper, [name]: value });
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12} className="text-center">
          <div style={{ backgroundColor: '#FFA500', height: '150px', position: 'relative' }}>
            {docente?.foto && (
              <img
                src={docente.foto}
                alt="Foto del Docente"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  position: 'absolute',
                  bottom: '-75px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  border: '5px solid white',
                }}
              />
            )}
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={8} className="text-center">
          <h3>{docente?.nombre || "Nombre del Docente"}</h3>
          <p>{docente?.correo || "Correo del Docente"}</p>
          <p>{docente?.titulo || "Título del Docente"}</p>
          <p>{docente?.frase || "Frase del Docente"}</p>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col md={8}>
          <h5>Papers</h5>
          {papers.length === 0 ? (
            <p>No hay papers agregados.</p>
          ) : (
            papers.map((paper, index) => (
              paper && paper.titulo && paper.link && (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <Card.Title>{paper.titulo}</Card.Title>
                    <a href={paper.link} target="_blank" rel="noopener noreferrer">Ver Paper</a>
                  </Card.Body>
                </Card>
              )
            ))
          )}
          <Button variant="primary" onClick={() => setShowModal(true)} className="mt-3">Añadir Paper</Button>
        </Col>
      </Row>

      {/* Modal para añadir nuevo paper */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Paper</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="titulo">
              <Form.Label>Título del Paper</Form.Label>
              <Form.Control
                type="text"
                name="titulo"
                value={newPaper.titulo}
                onChange={handleInputChange}
                placeholder="Ingrese el título"
              />
            </Form.Group>
            <Form.Group controlId="enlace" className="mt-3">
              <Form.Label>Enlace del Paper</Form.Label>
              <Form.Control
                type="text"
                name="link"
                value={newPaper.link}
                onChange={handleInputChange}
                placeholder="Ingrese el enlace"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAddPaper}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Perfil;
