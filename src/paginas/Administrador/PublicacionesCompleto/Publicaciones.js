import React, { useState, useEffect, useContext } from 'react';
import { obtenerPublicaciones, agregarPublicacion, manejarCambioFoto, eliminarPublicacion, actualizarPublicacion } from '../../../librerias/PeticionesApi';
import { AuthContext } from '../../../contextos/ContextoAutenticacion';

import { Container, Row, Col, Card,Form,FormControl, Button, InputGroup} from 'react-bootstrap';
import './Publicacion.css'
const Publicaciones = () => {
  const { idUsuario, token } = useContext(AuthContext);
  const [publicaciones, setPublicaciones] = useState([]);
  const [nuevaPublicacion, setNuevaPublicacion] = useState({
    nombre: '',
    numero:'',
    foto: '',
    contenido: '',
    redactor: '',
  });
  const [fotoBase64, setFotoBase64] = useState('');
  const [contenidoExpandido, setContenidoExpandido] = useState({}); // Controla qué publicaciones están expandidas
  const [publicacionAEditar, setPublicacionAEditar] = useState(null); // Controla si se está editando
  const [busqueda, setBusqueda] = useState('');
  // Obtener publicaciones desde el backend
  const fetchPublicaciones = async (Numero) => {
    try {
      const data = await obtenerPublicaciones(Numero);
      setPublicaciones(data.publicaciones || []);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    }
  };

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    fetchPublicaciones(0);
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
        console.log(publicacionData);
        let response;

        if (publicacionAEditar) {
          
            response = await actualizarPublicacion(publicacionAEditar.id, publicacionData, idUsuario, token);
            
        } else {
            response = await agregarPublicacion(publicacionData, idUsuario, token);
        }

        console.log('Respuesta del backend:', response); // Agrega este log para depurar

        if (response && response.salida) {
            console.log('Operación exitosa:', response.mensaje || 'Operación realizada correctamente');
            setNuevaPublicacion({ nombre: '', numero: '', contenido: '', redactor: '', foto: '' });
            setFotoBase64('');
            setPublicacionAEditar(null); // Reiniciar el estado de edición
            fetchPublicaciones(0); // Actualiza la lista de publicaciones
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
      setPublicaciones((prev) => prev.filter((pub) => pub.id !== id));
      fetchPublicaciones(0);
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
  
  const handleSearch = () => {
    const numeroBusqueda = parseInt(busqueda, 10); // Convierte la búsqueda en número
    if (!isNaN(numeroBusqueda)) {
      fetchPublicaciones(numeroBusqueda); // Llama a fetchPublicaciones con el número ingresado
    } else {
      console.error('Por favor ingresa un número válido');
    }
  };
  


  return (
    <Container className='hijita1'>
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
                type="number" // Establece el tipo como número
                placeholder="Número de chasquiposta"
                value={nuevaPublicacion.numero}
                onChange={(e) => handleChange('numero', parseInt(e.target.value, 10) || '')} // Asegura que sea un número o vacío
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
      <Form className="d-flex mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <FormControl
          type="search"
          placeholder="Buscar por número..."
          className="me-2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)} // Actualiza el estado de búsqueda
        />
        <Button variant="primary" onClick={handleSearch}>
          Buscar
        </Button>
      </Form>

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
                    <strong>{publicacion.numero}</strong>
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
