import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Card, Row, Col, Form } from 'react-bootstrap';
import { obtenerEstudiantes, agregarEstudiante, actualizarEstudiante, eliminarEstudiante, obtenerNivelesAcademicos , manejarCambioFoto} from '../../librerias/PeticionesApi';
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
    nivelAcademico: '',
    correo: '',
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
      .then((niveles) => {
        setNivelesAcademicos(niveles);
      })
      .catch(console.error);
  }, []);

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setActualizarFoto(false);
    setNuevoEstudiante({ nombre: '', nivelAcademico: '', correo: '', foto: '', agregarTesis: false, tesis: {} });
  };

  const handleShow = () => setShow(true);

  const agregarNuevoEstudiante = async () => {
    const estudianteData = {
      nombre: nuevoEstudiante.nombre,
      nivelAcademico: nuevoEstudiante.nivelAcademico,
      correo: nuevoEstudiante.correo,
      foto: nuevoEstudiante.foto,
      tesis: nuevoEstudiante.agregarTesis ? nuevoEstudiante.tesis : null,
    };

    try {
      const response = await agregarEstudiante(estudianteData, idUsuario, token);
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
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
        if (response.mensaje === 'TKIN') {
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
    setNuevoEstudiante({
      nombre: estudiante.nombre,
      nivelAcademico: estudiante.nivelAcademico,
      correo: estudiante.correo,
      foto: '',
      agregarTesis: !!estudiante.tesis,
      tesis: estudiante.tesis || {
        titulo: '',
        tipo: '',
        fechaPublicacion: '',
        resumen: '',
        contenido: '',
      },
    });
    setActualizarFoto(false);
    handleShow();
  };

  const actualizarEstudianteExistente = async () => {
    const estudianteData = {
      nombre: nuevoEstudiante.nombre,
      nivelAcademico: nuevoEstudiante.nivelAcademico,
      correo: nuevoEstudiante.correo,
      foto: actualizarFoto ? nuevoEstudiante.foto : null,
      tesis: nuevoEstudiante.agregarTesis ? nuevoEstudiante.tesis : null,
    };

    try {
      const response = await actualizarEstudiante(estudianteIdActualizar, estudianteData, idUsuario, token);
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
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
              <Card.Img variant="top" src={estudiante.foto || 'https://cdn-icons-png.freepik.com/256/2307/2307607.png?ga=GA1.1.646280353.1730388091&semt=ais_hybrid'} alt="Foto del Estudiante" className="estudiante-foto" />
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
                {nivelesAcademicos.map((nivel) => (
                  <option key={nivel.id} value={nivel.nombre}>{nivel.nombre}</option>
                ))}
              </Form.Control>
            </Form.Group>
            {isUpdating && (
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  label="Actualizar Foto"
                  checked={actualizarFoto}
                  onChange={() => setActualizarFoto(!actualizarFoto)}
                />
              </Form.Group>
            )}
            {(!isUpdating || actualizarFoto) && (
              <Form.Group className="mb-3">
                <Form.Label>Foto del Estudiante</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={(e) => manejarCambioFoto(e, setFotoBase64)} />
              </Form.Group>
            )}
            <Form.Check
              type="switch"
              id="switchTesis"
              label="¿Agregar Tesis?"
              checked={nuevoEstudiante.agregarTesis}
              onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, agregarTesis: e.target.checked })}
              className="mt-3"
            />
            {nuevoEstudiante.agregarTesis && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Título de la Tesis</Form.Label>
                  <Form.Control
                    type="text"
                    value={nuevoEstudiante.tesis.titulo}
                    onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, tesis: { ...nuevoEstudiante.tesis, titulo: e.target.value } })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Tesis</Form.Label>
                  <Form.Control
                    type="text"
                    value={nuevoEstudiante.tesis.tipo}
                    onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, tesis: { ...nuevoEstudiante.tesis, tipo: e.target.value } })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Publicación</Form.Label>
                  <Form.Control
                    type="date"
                    value={nuevoEstudiante.tesis.fechaPublicacion}
                    onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, tesis: { ...nuevoEstudiante.tesis, fechaPublicacion: e.target.value } })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Resumen de la Tesis</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={nuevoEstudiante.tesis.resumen}
                    onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, tesis: { ...nuevoEstudiante.tesis, resumen: e.target.value } })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contenido de la Tesis (PDF)</Form.Label>
                  <Form.Control type="file" accept="application/pdf" onChange={(e) => manejarCambioFoto(e, (base64) => setNuevoEstudiante((prev) => ({ ...prev, tesis: { ...prev.tesis, contenido: base64 } })))} />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={isUpdating ? actualizarEstudianteExistente : agregarNuevoEstudiante}>
            {isUpdating ? 'Actualizar' : 'Agregar'}
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
