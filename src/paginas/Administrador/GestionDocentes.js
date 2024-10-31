import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, Row, Col, Form } from 'react-bootstrap';
import { obtenerDocentes, agregarDocente, actualizarDocente, eliminarDocente, obtenerTitulos } from '../../librerias/PeticionesApi';
import '../../estilos/AdministradorEstilos/GestionDocentes.css';

const GestionDocentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [titulos, setTitulos] = useState([]);
  const [show, setShow] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [docenteIdActualizar, setDocenteIdActualizar] = useState(null);
  const [docenteIdEliminar, setDocenteIdEliminar] = useState(null);
  const [nuevoDocente, setNuevoDocente] = useState({
    nombre: '',
    email: '',
    titulo: '',
    frase: '',
    foto: null,
  });

  useEffect(() => {
    const idUsuario = '';  
    const token = '';      

    obtenerDocentes(idUsuario, token)
      .then((data) => {
        if (data.salida) setDocentes(data.docentes);
      })
      .catch(console.error);

    obtenerTitulos()
      .then((titulos) => {
        setTitulos(titulos);
      })
      .catch(console.error);
  }, []);

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setNuevoDocente({ nombre: '', email: '', titulo: '', frase: '', foto: null });
  };

  const handleShow = () => setShow(true);

  const agregarNuevoDocente = async () => {
    const rutaFoto = nuevoDocente.foto ? `docentes/${nuevoDocente.foto.name}` : '';
    const docenteData = { ...nuevoDocente, ruta: rutaFoto };

    try {
      await agregarDocente(docenteData);
      obtenerDocentes().then((data) => setDocentes(data.docentes));
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const iniciarEliminacion = (id) => {
    setDocenteIdEliminar(id);
    setShowEliminarModal(true);
  };

  const confirmarEliminacion = async () => {
    try {
      await eliminarDocente(docenteIdEliminar);
      obtenerDocentes().then((data) => setDocentes(data.docentes));
      setShowEliminarModal(false);
      setDocenteIdEliminar(null);
    } catch (error) {
      console.error(error);
    }
  };

  const iniciarActualizacion = (docente) => {
    setIsUpdating(true);
    setDocenteIdActualizar(docente.id);
    setNuevoDocente({
      nombre: docente.nombre,
      email: docente.correo,
      titulo: docente.titulo,
      frase: docente.frase,
      foto: docente.foto,
    });
    handleShow();
  };

  const actualizarDocenteExistente = async () => {
    const rutaFoto = nuevoDocente.foto ? `docentes/${nuevoDocente.foto.name}` : '';
    const docenteData = {
      nombre: nuevoDocente.nombre,
      correo: nuevoDocente.email,
      titulo: nuevoDocente.titulo,
      frase: nuevoDocente.frase,
      ruta: rutaFoto,
    };

    try {
      await actualizarDocente(docenteIdActualizar, docenteData);
      obtenerDocentes().then((data) => setDocentes(data.docentes));
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const manejarCambioFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const rutaFoto = `docentes/${file.name}`;
      setNuevoDocente({ ...nuevoDocente, foto: rutaFoto });

      const reader = new FileReader();
      reader.onloadend = () => {
        const url = URL.createObjectURL(file);
        setNuevoDocente({ ...nuevoDocente, foto: url });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="gestion-docentes-container">
      <div className="header">
        <h2>Gestión de Docentes</h2>
        <Button className="add-docente-btn" onClick={handleShow}>
          Agregar Docente
        </Button>
      </div>

      <Row>
        {docentes.map((docente) => (
          <Col md={4} key={docente.id}>
            <Card className="docente-card mb-4">
              <Card.Img variant="top" src={docente.foto || '/ruta/a/foto-placeholder.jpg'} alt="Foto del Docente" className="docente-foto" />
              <Card.Body>
                <Card.Title>{docente.nombre}</Card.Title>
                <Card.Text>Email: {docente.correo ? JSON.stringify(docente.correo) : 'N/A'}</Card.Text>
                <Card.Text>Título: {docente.titulo ? JSON.stringify(docente.titulo) : 'N/A'}</Card.Text>
                <Card.Text>Frase: {docente.frase ? JSON.stringify(docente.frase) : 'N/A'}</Card.Text>

                <Button variant="warning" onClick={() => iniciarActualizacion(docente)} className="me-2">Actualizar</Button>
                <Button variant="danger" onClick={() => iniciarEliminacion(docente.id)}>Eliminar</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>{isUpdating ? 'Actualizar Docente' : 'Agregar Docente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nuevoDocente.nombre}
                onChange={(e) => setNuevoDocente({ ...nuevoDocente, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={nuevoDocente.email}
                onChange={(e) => setNuevoDocente({ ...nuevoDocente, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                as="select"
                value={nuevoDocente.titulo}
                onChange={(e) => setNuevoDocente({ ...nuevoDocente, titulo: e.target.value })}
              >
                <option value="">Selecciona un título</option>
                {titulos.map((titulo, index) => (
                  <option key={index} value={titulo}>{titulo}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Frase</Form.Label>
              <Form.Control
                type="text"
                value={nuevoDocente.frase}
                onChange={(e) => setNuevoDocente({ ...nuevoDocente, frase: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Foto del Docente</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={manejarCambioFoto} />
              {nuevoDocente.foto && (
                <div className="vista-previa">
                  <img src={nuevoDocente.foto} alt="Vista previa" className="foto-previa" />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button className="add-docente-btn" onClick={isUpdating ? actualizarDocenteExistente : agregarNuevoDocente}>
            {isUpdating ? 'Actualizar' : 'Agregar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEliminarModal} onHide={() => setShowEliminarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este docente?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEliminarModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminacion}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionDocentes;
