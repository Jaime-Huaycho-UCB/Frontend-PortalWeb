import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Card, Row, Col, Form } from 'react-bootstrap';
import { obtenerEstudiantes, agregarEstudiante, actualizarEstudiante, eliminarEstudiante, obtenerNivelesAcademicos } from '../../librerias/PeticionesApi';
import '../../estilos/AdministradorEstilos/GestionEstudiantes.css';
import { AuthContext } from '../../contextos/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';

const GestionEstudiantes = () => {
  const { idUsuario, token } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState([]);
  const [nivelesAcademicos, setNivelesAcademicos] = useState([]);
  const [show, setShow] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [estudianteIdActualizar, setEstudianteIdActualizar] = useState(null);
  const [estudianteIdEliminar, setEstudianteIdEliminar] = useState(null);
  const navigate = useNavigate();
  const { cerrarSesion } = useContext(AuthContext); 

  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: '',
    correo: '',
    nivelAcademico: '',
    foto: '',
    agregarTesis: false,
    tesis: {
      titulo: '',
      tipo: '',
      fechaPublicacion: '',
      resumen: '',
      contenido: '',
    }
  });
  const [actualizarFoto, setActualizarFoto] = useState(false);

  const setFotoBase64 = (base64) => {
    setNuevoEstudiante((prevEstudiante) => ({ ...prevEstudiante, foto: base64 }));
  };

  useEffect(() => {  
    obtenerEstudiantes()
      .then((data) => {
        if (data.salida) setEstudiantes(data.estudiantes);
      })
      .catch(console.error);

    obtenerNivelesAcademicos()
      .then((nivelesAcademicos) => {
        setNivelesAcademicos(nivelesAcademicos);
      })
      .catch(console.error);
  }, []);

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setActualizarFoto(false);
    setNuevoEstudiante({
      nombre: '',
      correo: '',
      nivelAcademico: '',
      foto: '',
      agregarTesis: false,
      tesis: { titulo: '', tipo: '', fechaPublicacion: '', resumen: '', contenido: '' },
    });
  };

  const handleShow = () => setShow(true);

  const agregarNuevoEstudiante = async () => {
    const estudianteData = {
      ...nuevoEstudiante,
      tesis: nuevoEstudiante.agregarTesis ? nuevoEstudiante.tesis : null,
    };
  
    try {
      const response = await agregarEstudiante(estudianteData, idUsuario, token); 
      if (!response.salida) {
        if(response.mensaje === 'TKIN'){
          cerrarSesion(); 
          navigate('/iniciar-sesion'); 
          return;
        } else {
          console.error(response.mensaje);
        }
      }
      obtenerEstudiantes().then((data) => setEstudiantes(data.estudiantes));
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const iniciarEliminacion = (id) => {
    setEstudianteIdEliminar(id);
    setShowEliminarModal(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const response = await eliminarEstudiante(estudianteIdEliminar, idUsuario, token);
      if (!response.salida) {
        if(response.mensaje === 'TKIN'){
          cerrarSesion(); 
          navigate('/iniciar-sesion'); 
          return;
        } else {
          console.error(response.mensaje);
        }
      }
      obtenerEstudiantes().then((data) => setEstudiantes(data.estudiantes));
      setShowEliminarModal(false);
      setEstudianteIdEliminar(null);
    } catch (error) {
      console.error(error);
    }
  };

  const iniciarActualizacion = (estudiante) => {
    setIsUpdating(true);
    setEstudianteIdActualizar(estudiante.id);
    setNuevoEstudiante(estudiante);
    setActualizarFoto(false);
    handleShow();
  };

  const actualizarEstudianteExistente = async () => {
    const estudianteData = {
      ...nuevoEstudiante,
      foto: actualizarFoto ? nuevoEstudiante.foto : null,
      tesis: nuevoEstudiante.agregarTesis ? nuevoEstudiante.tesis : null,
    };

    try {
      const response = await actualizarEstudiante(estudianteIdActualizar, estudianteData, idUsuario, token);
      if (!response.salida) {
        if(response.mensaje === 'TKIN'){
          cerrarSesion(); 
          navigate('/iniciar-sesion'); 
          return;
        } else {
          console.error(response.mensaje);
        }
      }
      obtenerEstudiantes().then((data) => setEstudiantes(data.estudiantes));
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="gestion-estudiantes-container">
      <div className="header">
        <h2>Gestión de Estudiantes</h2>
        <Button className="add-estudiante-btn" onClick={handleShow}>
          Agregar Estudiante
        </Button>
      </div>

      <Row>
        {estudiantes.map((estudiante) => (
          <Col md={4} key={estudiante.id}>
            <Card className="estudiante-card mb-4">
              <Card.Img variant="top" src={estudiante.foto || 'https://cdn-icons-png.freepik.com/256/2307/2307607.png'} alt="Foto del Estudiante" className="estudiante-foto" />
              <Card.Body>
                <Card.Title>{estudiante.nombre}</Card.Title>
                <Card.Text>Email: {estudiante.correo || 'N/A'}</Card.Text>
                <Card.Text>Nivel Académico: {estudiante.nivelAcademico || 'N/A'}</Card.Text>
                <Button variant="warning" onClick={() => iniciarActualizacion(estudiante)} className="me-2">Actualizar</Button>
                <Button variant="danger" onClick={() => iniciarEliminacion(estudiante.id)}>Eliminar</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdating ? 'Actualizar Estudiante' : 'Agregar Estudiante'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nuevoEstudiante.nombre}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={nuevoEstudiante.correo}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, correo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nivel Académico</Form.Label>
              <Form.Control
                as="select"
                value={nuevoEstudiante.nivelAcademico}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, nivelAcademico: e.target.value })}
              >
                <option value="">Selecciona un nivel</option>
                {nivelesAcademicos.map((nivelesAcademicos) => (
                  <option key={nivelesAcademicos.id} value={nivelesAcademicos.id}>{nivelesAcademicos.nombre}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Foto del Estudiante</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFotoBase64(reader.result.split(',')[1]);
                  };
                  if (file) reader.readAsDataURL(file);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button onClick={isUpdating ? actualizarEstudianteExistente : agregarNuevoEstudiante}>
            {isUpdating ? 'Actualizar' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEliminarModal} onHide={() => setShowEliminarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este estudiante?</Modal.Body>
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

export default GestionEstudiantes;
