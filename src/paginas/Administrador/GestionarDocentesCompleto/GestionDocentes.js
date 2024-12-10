import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Card, Row, Col, Form } from 'react-bootstrap';
import{MenuItem,Typography,FormControl,InputLabel,Select} from '@mui/material'
import { manejarCambioFoto, agregarDocente, actualizarDocente, eliminarDocente, obtenerTitulos, obtenerDocentesTodo } from '../../../librerias/PeticionesApi';
import './GestionDocentes.css';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contextos/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';
import { FilterList } from '@mui/icons-material'; 
const GestionDocentes = () => {
  const { idUsuario, token } = useContext(AuthContext);
  const [docentes, setDocentes] = useState([]);
  const [titulos, setTitulos] = useState([]);
  const [show, setShow] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [docenteIdActualizar, setDocenteIdActualizar] = useState(null);
  const [docenteIdEliminar, setDocenteIdEliminar] = useState(null);
  const navigate = useNavigate();
  const { cerrarSesion } = useContext(AuthContext); 
  

  const [nuevoDocente, setNuevoDocente] = useState({
    nombre: '',
    correo: '',
    titulo: '',
    frase: '',
    fotoBase64: '',
  });
  const [actualizarFoto, setActualizarFoto] = useState(false);

  const setFotoBase64 = (base64) => {
    setNuevoDocente((prevDocente) => ({ ...prevDocente, fotoBase64: base64 }));
  };

    
  const cargarDocentes = async (id) => {
    try {
      // Obtener docentes
      const data = await obtenerDocentesTodo(id);
      if (data.salida) {
        setDocentes(data.docentes);
      } else {
        setDocentes([]);
        // Mostrar alerta cuando no hay docentes
        Swal.fire({
          title: 'Sin Resultados',
          text: data.mensaje || 'No se encontraron docentes disponibles para el criterio seleccionado.',
          icon: 'info',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6', // Color del botón de confirmación
          customClass: {
            title: 'swal-title-fixed', // Clase personalizada para el título
          },
        });
      }
  
      // Obtener títulos
      const titulos = await obtenerTitulos();
      setTitulos(titulos || []);
    } catch (error) {
      console.error("Error al cargar docentes o títulos:", error);
      // Mostrar alerta en caso de error
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cargar los docentes o los títulos. Por favor, intenta nuevamente más tarde.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#d33', // Botón de error en rojo
      });
    }
  };
  
  useEffect(() => {
    cargarDocentes(0);
  }, []);
  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setActualizarFoto(false);
    setNuevoDocente({ nombre: '', correo: '', titulo: '', frase: '', fotoBase64: '' });
  };

  const handleShow = () => setShow(true);

  

  const agregarNuevoDocente = async () => {
    const docenteData = {
      nombre: nuevoDocente.nombre,
      correo: nuevoDocente.correo,
      titulo: nuevoDocente.titulo,
      frase: nuevoDocente.frase,
      fotoBase64: nuevoDocente.fotoBase64,
    };
  
    // Validaciones
    if (!docenteData.nombre.trim()) {
      Swal.fire({
        title: 'Campo Obligatorio',
        text: 'El nombre no puede estar vacío.',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!/^[a-zA-Z\s.]+$/.test(docenteData.nombre)) {
      Swal.fire({
        title: 'Nombre Inválido',
        text: 'El nombre solo puede contener letras, espacios y puntos. No se permiten números ni otros caracteres especiales.',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
    
  
    if (!docenteData.correo.trim()) {
      Swal.fire({
        title: 'Campo Obligatorio',
        text: 'El correo no puede estar vacío.',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(docenteData.correo)) {
      Swal.fire({
        title: 'Correo Inválido',
        text: 'El correo debe tener un formato válido (ejemplo: usuario@dominio.com).',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!docenteData.titulo.trim()) {
      Swal.fire({
        title: 'Campo Obligatorio',
        text: 'El título no puede estar vacío.',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    // Intentar agregar al docente si las validaciones pasan
    try {
      const response = await agregarDocente(docenteData, idUsuario, token);
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
          Swal.fire({
            title: 'Sesión Expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Iniciar Sesión',
            confirmButtonColor: '#d33',
          }).then(() => {
            cerrarSesion();
            navigate('/iniciar-sesion');
          });
          return;
        } else {
          Swal.fire({
            title: 'Error',
            text: response.mensaje,
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
          console.error(response.mensaje);
          return;
        }
      }
  
      Swal.fire({
        title: 'Docente Agregado',
        text: response.mensaje,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      });
  
      cargarDocentes(0);
      handleClose();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al agregar el docente. Por favor, inténtalo más tarde.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  };
  

  const iniciarEliminacion = (id) => {
    setDocenteIdEliminar(id);
    setShowEliminarModal(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const response = await eliminarDocente(docenteIdEliminar, idUsuario, token);
  
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
          Swal.fire({
            title: 'Sesión Expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Iniciar Sesión',
            confirmButtonColor: '#d33',
          }).then(() => {
            cerrarSesion();
            navigate('/iniciar-sesion');
          });
          return;
        } else {
          Swal.fire({
            title: 'Error',
            text: response.mensaje,
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
          console.error(response.mensaje);
          return;
        }
      }
  
      Swal.fire({
        title: 'Docente Eliminado',
        text: response.mensaje,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      });
  
      cargarDocentes(0);
      setShowEliminarModal(false);
      setDocenteIdEliminar(null);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al intentar eliminar el docente. Por favor, inténtalo más tarde.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  };
  

  const iniciarActualizacion = (docente) => {
    setIsUpdating(true);
    setDocenteIdActualizar(docente.id);
    setNuevoDocente({
      nombre: docente.nombre,
      correo: docente.correo,
      titulo: docente.titulo,
      frase: docente.frase,
      fotoBase64: '', 
    });
    setActualizarFoto(false);
    handleShow();
  };
  const actualizarDocenteExistente = async () => {
    // Validar formulario antes de enviar los datos
    if (!nuevoDocente.nombre || !nuevoDocente.correo || !nuevoDocente.titulo) {
      Swal.fire({
        title: 'Campos Vacíos',
        text: 'Por favor, completa todos los campos obligatorios.',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    // Validar que el nombre no contenga caracteres especiales ni números
    const nombreValido = /^[a-zA-Z\s.]+$/.test(nuevoDocente.nombre);
    if (!nombreValido) {
      Swal.fire({
        title: 'Nombre Inválido',
        text: 'El nombre solo puede contener letras, espacios y puntos. No se permiten números ni otros caracteres especiales.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
    
  
    // Validar formato del correo
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoDocente.correo);
    if (!correoValido) {
      Swal.fire({
        title: 'Correo Inválido',
        text: 'Por favor, ingresa un correo electrónico válido.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    const docenteData = {
      nombre: nuevoDocente.nombre,
      correo: nuevoDocente.correo,
      titulo: nuevoDocente.titulo,
      frase: nuevoDocente.frase,
      fotoBase64: actualizarFoto ? nuevoDocente.fotoBase64 : null,
    };
  
    try {
      const response = await actualizarDocente(docenteIdActualizar, docenteData, idUsuario, token);
  
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
          Swal.fire({
            title: 'Sesión Expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Iniciar Sesión',
            confirmButtonColor: '#d33',
          }).then(() => {
            cerrarSesion();
            navigate('/iniciar-sesion');
          });
          return;
        } else {
          Swal.fire({
            title: 'Error',
            text: response.mensaje,
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
          console.error(response.mensaje);
          return;
        }
      }
  
      Swal.fire({
        title: 'Docente Actualizado',
        text: response.mensaje,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      });
  
      cargarDocentes(0);
      handleClose();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar el docente. Por favor, inténtalo más tarde.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  };
  
  const [filtroSeleccionado, setFiltroSeleccionado] = useState(0);
  return (
    <div className="gestion-docentes-container">
      <div className="header">
        <h2>Gestión de Docentes</h2>
        <Button className="add-docente-btn" onClick={handleShow}>
          Agregar Docente
        </Button>
      </div>
      <Typography variant="h4" align="center" gutterBottom>
        Filtrar Docentes
      </Typography>
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
            cargarDocentes(filtroId);
          }}
          className="filtro-select"
        >
          <MenuItem value={0} className="filtro-menu-item">Obtener Todo</MenuItem>
          {titulos.map((titulo) => (
            <MenuItem key={titulo.id} value={titulo.id} className="filtro-menu-item">
              {titulo.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
    
      <Row>
        {docentes.map((docente) => (
          <Col md={4} key={docente.id}>
            <Card className="docente-card mb-4">
            <Card.Img
  variant="top"
  src={docente.foto || process.env.PUBLIC_URL + '/sin.webp'}
  alt="Foto del Docente"
  className="docente-foto"
/>

              <Card.Body>
                <Card.Title>{docente.nombre}</Card.Title>
                <Card.Text>Email: {docente.correo || 'N/A'}</Card.Text>
                <Card.Text>Título: {docente.titulo || 'N/A'}</Card.Text>
                <Card.Text>Frase: {docente.frase || 'N/A'}</Card.Text>

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
                value={nuevoDocente.correo}
                onChange={(e) => setNuevoDocente({ ...nuevoDocente, correo: e.target.value })}
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
                {titulos.map((titulo) => (
                  <option key={titulo.id} value={titulo.id}>{titulo.nombre}</option>
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
                <Form.Label>Foto del Docente</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={(e) => manejarCambioFoto(e, setFotoBase64)} />
                {nuevoDocente.fotoBase64 && (
                  <div className="vista-previa">
                    <img src={`data:image/jpeg;base64,${nuevoDocente.fotoBase64}`} alt="Vista previa" className="foto-previa" />
                  </div>
                )}
              </Form.Group>
            )}
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
