import React, { useState, useEffect, useContext } from 'react';
import { obtenerPublicaciones, agregarPublicacion, manejarCambioFoto, eliminarPublicacion, actualizarPublicacion } from '../../../librerias/PeticionesApi';
import { AuthContext } from '../../../contextos/ContextoAutenticacion';
import { Container, Row, Col, Card, Form, FormControl, Button } from 'react-bootstrap';
import './Publicacion.css';

const Publicaciones = () => {
  const { idUsuario, token } = useContext(AuthContext);
  const [publicaciones, setPublicaciones] = useState([]);
  const [nuevaPublicacion, setNuevaPublicacion] = useState({
    nombre: '',
    numero: '',
    foto: '',
    contenido: '',
    redactor: '',
  });
  const [fotoBase64, setFotoBase64] = useState('');
  const [contenidoExpandido, setContenidoExpandido] = useState({});
  const [publicacionAEditar, setPublicacionAEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [publicacionesFiltradas, setPublicacionesFiltradas] = useState([]);

  // Obtener publicaciones desde el backend
  const fetchPublicaciones = async () => {
    try {
      const data = await obtenerPublicaciones(0);
      setPublicaciones(data.publicaciones || []);
      setPublicacionesFiltradas(data.publicaciones || []); // Inicializa las publicaciones filtradas
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    }
  };

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    fetchPublicaciones();
  }, []);

  // Filtrar publicaciones en función de la búsqueda
  useEffect(() => {
    if (!busqueda.trim()) {
      setPublicacionesFiltradas(publicaciones);
    } else {
      setPublicacionesFiltradas(
        publicaciones.filter((pub) =>
          pub.numero && pub.numero.toString().includes(busqueda)
        )
      );
    }
  }, [busqueda, publicaciones]);

  // Manejo de cambios en el formulario
  const handleChange = (campo, valor) => {
    setNuevaPublicacion((prevState) => ({ ...prevState, [campo]: valor }));
  };

  // Manejo del envío de una nueva publicación o actualización
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const publicacionData = { ...nuevaPublicacion, foto: fotoBase64 };
      let response;

      if (publicacionAEditar) {
        response = await actualizarPublicacion(publicacionAEditar.id, publicacionData, idUsuario, token);
      } else {
        response = await agregarPublicacion(publicacionData, idUsuario, token);
      }

      if (response && response.salida) {
        setNuevaPublicacion({ nombre: '', numero: '', contenido: '', redactor: '', foto: '' });
        setFotoBase64('');
        setPublicacionAEditar(null);
        fetchPublicaciones();
      } else {
        console.error('Error en la operación:', response?.mensaje || 'Ocurrió un error inesperado');
      }
    } catch (error) {
      console.error('Error al guardar publicación:', error);
    }
  };

  // Manejo de eliminación de publicaciones
  const handleEliminar = async (id) => {
    try {
      await eliminarPublicacion(id, idUsuario, token);
      fetchPublicaciones();
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
    }
  };

  // Manejo de edición de publicaciones
  const handleEditar = (publicacion) => {
    setNuevaPublicacion({
      nombre: publicacion.nombre,
      numero: publicacion.numero,
      contenido: publicacion.contenido,
      redactor: publicacion.redactor,
    });
    setFotoBase64('');
    setPublicacionAEditar(publicacion);
  };

  // Alternar expansión de contenido
  const toggleExpandirContenido = (id) => {
    setContenidoExpandido((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container className="hijita1">
      {/* Sección para crear o actualizar publicación */}
      <Row className="mt-4">
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="p-3 shadow-sm">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNombre">
                <Form.Control
                  type="text"
                  placeholder="Nombre de la publicación"
                  value={nuevaPublicacion.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  className="mb-3"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formRedactor">
                <Form.Control
                  type="text"
                  placeholder="Redactor"
                  value={nuevaPublicacion.redactor}
                  onChange={(e) => handleChange('redactor', e.target.value)}
                  className="mb-3"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNumero">
                <Form.Control
                  type="number"
                  placeholder="Número de chasquiposta"
                  value={nuevaPublicacion.numero}
                  onChange={(e) => handleChange('numero', parseInt(e.target.value, 10) || '')}
                  className="mb-3"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formContenido">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Escribe el contenido..."
                  value={nuevaPublicacion.contenido}
                  onChange={(e) => handleChange('contenido', e.target.value)}
                  className="mb-3"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formFoto" className="mb-3">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => manejarCambioFoto(e, setFotoBase64)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                {publicacionAEditar ? 'Actualizar Publicación' : 'Publicar'}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Barra de búsqueda */}
      <Form className="d-flex mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <FormControl
          type="search"
          placeholder="Buscar por número..."
          className="me-2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </Form>

      {/* Muro de publicaciones */}
      <Row className="mt-5">
        <Col md={{ span: 8, offset: 2 }}>
          {publicacionesFiltradas.length > 0 ? (
            publicacionesFiltradas.map((publicacion) => (
              <Card className="mb-4 shadow-sm" key={publicacion.id}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{publicacion.nombre}</strong>
                    <br />
                    <strong>{publicacion.numero}</strong>
                    <br />
                    <small>{publicacion.redactor}</small>
                  </div>
                  <div>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditar(publicacion)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleEliminar(publicacion.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {publicacion.foto && (
                    <div className="text-center mb-3">
                      <img
                        src={`${publicacion.foto}`}
                        alt="Publicación"
                        style={{ maxWidth: '100%', borderRadius: '10px' }}
                      />
                    </div>
                  )}
                  <Card.Text>
                    {contenidoExpandido[publicacion.id] || publicacion.contenido.length <= 100
                      ? publicacion.contenido
                      : `${publicacion.contenido.substring(0, 100)}...`}
                    {publicacion.contenido.length > 100 && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => toggleExpandirContenido(publicacion.id)}
                      >
                        {contenidoExpandido[publicacion.id] ? 'Ver menos' : 'Ver más'}
                      </Button>
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted">No hay publicaciones disponibles.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Publicaciones;
