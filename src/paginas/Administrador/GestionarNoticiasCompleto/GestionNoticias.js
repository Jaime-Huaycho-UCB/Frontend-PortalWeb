import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Button, Form, Modal, Table, InputGroup, FormControl, Pagination } from 'react-bootstrap';
import { agregarNoticia, obtenerNoticias, actualizarNoticia, eliminarNoticia ,manejarCambioFoto} from '../../../librerias/PeticionesApi';
import { AuthContext } from '../../../contextos/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';
import './GestionNoticias.css';
import Swal from 'sweetalert2';
const GestionNoticias = () => {
  const { idUsuario, token, cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [noticias, setNoticias] = useState([]);
  const [filteredNoticias, setFilteredNoticias] = useState([]);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
  const [newNoticia, setNewNoticia] = useState({
    titulo: '',
    redactor: '',
    resumen: '',
    fechaPublicacion: '',
    fotoRelleno: null,
    fotoNoticia: '',
    noticia: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activePage, setActivePage] = useState(1);
  const noticiasPerPage = 5;

  const agregarNuevaNoticia = async () => {
    // Validaciones
    if (!newNoticia.titulo.trim()) {
      Swal.fire({
        title: 'Título Requerido',
        text: 'El título de la noticia no puede estar vacío.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!newNoticia.redactor.trim()) {
      Swal.fire({
        title: 'Redactor Requerido',
        text: 'El nombre del redactor no puede estar vacío.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!/^[a-zA-Z.\s]+$/.test(newNoticia.redactor)) {
      Swal.fire({
        title: 'Nombre de Redactor Inválido',
        text: 'El nombre del redactor solo puede contener letras, espacios y puntos.',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!newNoticia.resumen.trim()) {
      Swal.fire({
        title: 'Resumen Requerido',
        text: 'El resumen de la noticia no puede estar vacío.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!newNoticia.fechaPublicacion.trim()) {
      Swal.fire({
        title: 'Fecha Requerida',
        text: 'La fecha de publicación no puede estar vacía.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(newNoticia.fechaPublicacion)) {
      Swal.fire({
        title: 'Fecha Inválida',
        text: 'La fecha debe estar en formato YYYY-MM-DD.',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
  
    if (!newNoticia.noticia.trim()) {
      Swal.fire({
        title: 'Contenido Requerido',
        text: 'El contenido de la noticia no puede estar vacío.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    try {
      const response = await agregarNoticia(newNoticia, idUsuario, token);
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
          return;
        }
      }
  
      Swal.fire({
        title: 'Noticia Agregada',
        text: response.mensaje,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      });
  
      cargarNoticias();
      setShowModal(false);
      setNewNoticia({
        titulo: '',
        redactor: '',
        resumen: '',
        fechaPublicacion: '',
        fotoRelleno: null,
        fotoNoticia: '',
        noticia: '',
      });
    } catch (error) {
      console.error('Error al agregar noticia:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al agregar la noticia. Por favor, inténtalo más tarde.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  };
  
  const setFotoNoticia = (base64) => {
    setNewNoticia((prevNoticia) => ({ ...prevNoticia, fotoNoticia: base64 }));
  };
  const setFotoRelleno = (base64) => {
    setNewNoticia((prevNoticia) => ({ ...prevNoticia, fotoRelleno: base64 }));
  };
  const cargarNoticias = async () => {
    try {
      const data = await obtenerNoticias();
      if (data.salida) {
        setNoticias(data.noticias);
      } else {
        setNoticias([]);
      }
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    }
  };

  // Ejecutar cargarNoticias al montar el componente
  useEffect(() => {
    cargarNoticias();
  }, []);

  // Filtrar noticias al cambiar el término de búsqueda
  useEffect(() => {
    const filtered = noticias.filter((noticia) =>
      noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.redactor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNoticias(filtered);
  }, [searchTerm, noticias]);

  // Función para eliminar una noticia
  const confirmarEliminacion = async (id) => {
    try {
      const response = await eliminarNoticia(id, idUsuario, token);
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
          Swal.fire({
            title: 'Sesión Expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Iniciar Sesión',
          }).then(() => {
            cerrarSesion();
            navigate('/iniciar-sesion');
          });
          return;
        } else {
          Swal.fire({
            title: 'Error',
            text: response.mensaje || 'No se pudo eliminar la noticia.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
          return;
        }
      }

      Swal.fire({
        title: 'Eliminada',
        text: response.mensaje || 'La noticia ha sido eliminada exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      cargarNoticias(); // Llama directamente a cargarNoticias después de eliminar
    } catch (error) {
      console.error("Error al eliminar noticia:", error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al intentar eliminar la noticia. Por favor, inténtalo más tarde.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  useEffect(() => {
    const filtered = noticias.filter(noticia =>
      noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.redactor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNoticias(filtered);
  }, [searchTerm, noticias]);

  
  const iniciarEdicion = (noticia) => {
    setIsUpdating(true);
    // Asegúrate de que aquí estás asignando el id correctamente, revisa si es `noticia.id` o `noticia.idNoticia`
    setNoticiaSeleccionada(noticia.idNoticia || noticia.id); // Asegura que exista el id antes de usarlo
    setNewNoticia({
      titulo: noticia.titulo,
      redactor: noticia.redactor,
      resumen: noticia.resumen,
      fechaPublicacion: noticia.fechaPublicacion,
      fotoRelleno: null,
      fotoNoticia: '',
      noticia: noticia.noticia,
    });
    setShowModal(true);
  }
  

  const actualizarNoticiaExistente = async () => {
    // Validaciones
    if (!newNoticia.titulo.trim()) {
      Swal.fire({
        title: 'Título Requerido',
        text: 'El título de la noticia no puede estar vacío.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!newNoticia.redactor.trim()) {
      Swal.fire({
        title: 'Redactor Requerido',
        text: 'El nombre del redactor no puede estar vacío.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!/^[a-zA-Z.\s]+$/.test(newNoticia.redactor)) {
      Swal.fire({
        title: 'Nombre de Redactor Inválido',
        text: 'El nombre del redactor solo puede contener letras, espacios y puntos.',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!newNoticia.resumen.trim()) {
      Swal.fire({
        title: 'Resumen Requerido',
        text: 'El resumen de la noticia no puede estar vacío.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!newNoticia.fechaPublicacion.trim()) {
      Swal.fire({
        title: 'Fecha Requerida',
        text: 'La fecha de publicación no puede estar vacía.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(newNoticia.fechaPublicacion)) {
      Swal.fire({
        title: 'Fecha Inválida',
        text: 'La fecha debe estar en formato YYYY-MM-DD.',
        icon: 'warning',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!newNoticia.fotoRelleno) {
      Swal.fire({
        title: 'Imagen Requerida',
        text: 'Debes seleccionar una imagen de relleno para la noticia.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    if (!newNoticia.noticia.trim()) {
      Swal.fire({
        title: 'Contenido Requerido',
        text: 'El contenido de la noticia no puede estar vacío.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  
    try {
      const response = await actualizarNoticia(noticiaSeleccionada, newNoticia, idUsuario, token);
  
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
          return;
        }
      }
  
      Swal.fire({
        title: 'Noticia Actualizada',
        text: response.mensaje,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      });
  
      cargarNoticias();
      setShowModal(false);
      setIsUpdating(false);
      setNewNoticia({
        titulo: '',
        redactor: '',
        resumen: '',
        fechaPublicacion: '',
        fotoRelleno: null,
        fotoNoticia: '',
        noticia: '',
      });
    } catch (error) {
      console.error('Error al actualizar noticia:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar la noticia. Por favor, inténtalo más tarde.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setActivePage(1); 
  };

  // Paginación
  const indexOfLastNoticia = activePage * noticiasPerPage;
  const indexOfFirstNoticia = indexOfLastNoticia - noticiasPerPage;
  const currentNoticias = filteredNoticias.slice(indexOfFirstNoticia, indexOfLastNoticia);

  const handlePageChange = (pageNumber) => setActivePage(pageNumber);

  return (
    <div className="gestion-noticias-container">
      <div className="header">
        <h2>Gestión de Noticias</h2>
        <Button variant="primary" onClick={() => setShowModal(true)} className="add-noticia-btn">
          Agregar Noticia
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar noticias por título o redactor"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>

      {/* Lista de noticias */}
      <Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>Imagen</th>
      <th>Título</th>
      <th>Redactor</th>
      <th>Resumen</th>
      <th>Fecha de Publicación</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {currentNoticias.map((noticia) => (
      <tr key={noticia.idNoticia}>
        <td>
          {noticia.fotoNoticia ? (
            <img
              src={noticia.fotoNoticia}
              alt="Noticia"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          ) : (
            'Sin Imagen'
          )}
        </td>
        <td>{noticia.titulo}</td>
        <td>{noticia.redactor}</td>
        <td>{noticia.resumen}</td>
        <td>{noticia.fechaPublicacion}</td>
        <td>
          <Button variant="warning" onClick={() => iniciarEdicion(noticia)}>
            Actualizar
          </Button>
          <Button variant="danger" onClick={() => confirmarEliminacion(noticia.idNoticia)}>
            Eliminar
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>


      {/* Paginación */}
      <Pagination>
        {Array.from({ length: Math.ceil(filteredNoticias.length / noticiasPerPage) }).map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === activePage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Modal para agregar/editar noticias */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setIsUpdating(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdating ? 'Actualizar Noticia' : 'Agregar Nueva Noticia'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitulo">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={newNoticia.titulo}
                onChange={(e) => setNewNoticia({ ...newNoticia, titulo: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formRedactor" className="mt-3">
              <Form.Label>Redactor</Form.Label>
              <Form.Control
                type="text"
                value={newNoticia.redactor}
                onChange={(e) => setNewNoticia({ ...newNoticia, redactor: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formResumen" className="mt-3">
              <Form.Label>Resumen</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newNoticia.resumen}
                onChange={(e) => setNewNoticia({ ...newNoticia, resumen: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFechaPublicacion" className="mt-3">
              <Form.Label>Fecha de Publicación</Form.Label>
              <Form.Control
                type="date"
                value={newNoticia.fechaPublicacion}
                onChange={(e) => setNewNoticia({ ...newNoticia, fechaPublicacion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formNoticia" className="mt-3">
              <Form.Label>Noticia</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newNoticia.noticia}
                onChange={(e) => setNewNoticia({ ...newNoticia, noticia: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFotoNoticia" className="mt-3">
              <Form.Label>Foto Noticia</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => manejarCambioFoto(e, setFotoNoticia)}
              />
              {newNoticia.fotoNoticia && <img src={newNoticia.fotoNoticia} alt="Vista previa" className="foto-previa mt-3" />}
            </Form.Group>
          
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowModal(false); setIsUpdating(false); }}>Cerrar</Button>
          <Button variant="primary" onClick={isUpdating ? actualizarNoticiaExistente : agregarNuevaNoticia}>
            {isUpdating ? 'Actualizar' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionNoticias;
