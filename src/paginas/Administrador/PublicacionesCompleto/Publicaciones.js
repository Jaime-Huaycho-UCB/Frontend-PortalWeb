import React, { useState, useEffect, useContext } from 'react';
import { obtenerPublicaciones, agregarPublicacion, manejarCambioFoto, eliminarPublicacion, actualizarPublicacion } from '../../../librerias/PeticionesApi';
import { AuthContext } from '../../../contextos/ContextoAutenticacion';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const Publicaciones = () => {
  const { idUsuario, token } = useContext(AuthContext);
  const [publicaciones, setPublicaciones] = useState([]);
  const [nuevaPublicacion, setNuevaPublicacion] = useState({
    nombre: '',
    foto: '',
    contenido: '',
    redactor: '',
  });
  const [fotoBase64, setFotoBase64] = useState('');
  const [contenidoExpandido, setContenidoExpandido] = useState({}); // Controla qué publicaciones están expandidas
  const [publicacionAEditar, setPublicacionAEditar] = useState(null); // Controla si se está editando

  // Obtener publicaciones desde el backend
  const fetchPublicaciones = async () => {
    try {
      const data = await obtenerPublicaciones(idUsuario, token);
      setPublicaciones(data.publicaciones || []);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    }
  };

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    fetchPublicaciones();
  }, []);

  // Manejo de cambios en el formulario
  const handleChange = (campo, valor) => {
    setNuevaPublicacion((prevState) => ({ ...prevState, [campo]: valor }));
  };

  // Manejo del envío de una nueva publicación o actualización
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const publicacionData = { ...nuevaPublicacion, foto: fotoBase64 };

      if (publicacionAEditar) {
        await actualizarPublicacion(publicacionAEditar.id, publicacionData, idUsuario, token);
      } else {
        // Agregar nueva publicación
        await agregarPublicacion(publicacionData, idUsuario, token);
      }

      setNuevaPublicacion({ nombre: '', contenido: '', redactor: '', foto: '' });
      setFotoBase64('');
      setPublicacionAEditar(null); // Reiniciar el estado de edición
      fetchPublicaciones();
    } catch (error) {
      console.error('Error al guardar publicación:', error);
    }
  };

  // Manejo de eliminación de publicaciones
  const handleEliminar = async (id) => {
    try {
      await eliminarPublicacion(id, idUsuario, token);
      setPublicaciones((prev) => prev.filter((pub) => pub.id !== id));
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
    }
  };

  // Manejo de edición de publicaciones
  const handleEditar = (publicacion) => {
    setNuevaPublicacion({
      nombre: publicacion.nombre,
      contenido: publicacion.contenido,
      redactor: publicacion.redactor,
    });
    setFotoBase64(''); // Se debe cargar una nueva foto si se desea cambiar
    setPublicacionAEditar(publicacion); // Guardar referencia a la publicación que se edita
  };

  // Alternar expansión de contenido
  const toggleExpandirContenido = (id) => {
    setContenidoExpandido((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container>
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

      {/* Muro de publicaciones */}
      <Row className="mt-5">
        <Col md={{ span: 8, offset: 2 }}>
          {publicaciones.length > 0 ? (
            publicaciones.map((publicacion) => (
              <Card className="mb-4 shadow-sm" key={publicacion.id}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{publicacion.nombre}</strong>
                    <br />
                    <small>{publicacion.redactor}</small>
                  </div>
                  <div>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditar(publicacion)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleEliminar(publicacion.id)}>
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
