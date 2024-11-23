import React, { useState, useEffect, useContext } from 'react';
import {
  obtenerContactos,
  agregarContacto,
  eliminarContacto,
  actualizarContacto,
} from '../../librerias/PeticionesApi.js'; // Ajusta la ruta según sea necesario
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { AuthContext } from '../../contextos/ContextoAutenticacion.js';

const PieDePagina = () => {
  const [contactos, setContactos] = useState([]);
  const [nuevoContacto, setNuevoContacto] = useState({
    nombre: '',
    correo: '',
    papel: '',
  });
  const [editarContacto, setEditarContacto] = useState(false); // Controla el estado de edición
  const [idContactoEditar, setIdContactoEditar] = useState(null); // Solo para actualizar/eliminar
  const { idUsuario, token } = useContext(AuthContext);

  // Obtener contactos al montar el componente
  useEffect(() => {
    const fetchContactos = async () => {
      try {
        const data = await obtenerContactos();
        setContactos(data.contactos || []); // Maneja contactos como un arreglo
      } catch (error) {
        console.error('Error al cargar contactos:', error);
      }
    };

    fetchContactos();
  }, []);

  // Función para agregar un nuevo contacto
  const agregarNuevoContacto = async () => {
    try {
      console.log('Datos enviados:', nuevoContacto, idUsuario, token);
      const contactoAgregado = await agregarContacto(nuevoContacto, idUsuario, token);
      setContactos((prevContactos) => [...prevContactos, contactoAgregado]);
      limpiarFormulario();
    } catch (error) {
      console.error('Error al agregar contacto:', error.response?.data || error.message);
    }
  };

  // Función para actualizar un contacto existente
  const actualizarContactoExistente = async () => {
    try {
      await actualizarContacto(idContactoEditar, nuevoContacto, idUsuario, token);
      setContactos((prevContactos) =>
        prevContactos.map((contacto) =>
          contacto.idContacto === idContactoEditar ? { ...nuevoContacto, idContacto: idContactoEditar } : contacto
        )
      );
      limpiarFormulario();
    } catch (error) {
      console.error('Error al actualizar contacto:', error.response?.data || error.message);
    }
  };

  // Función para manejar el formulario de agregar/actualizar
  const handleSubmitContacto = async (e) => {
    e.preventDefault();
    if (editarContacto) {
      await actualizarContactoExistente();
    } else {
      await agregarNuevoContacto();
    }
  };

  // Función para eliminar un contacto
  const handleEliminarContacto = async (idContacto) => {
    try {
      await eliminarContacto(idContacto, idUsuario, token);
      setContactos((prevContactos) =>
        prevContactos.filter((contacto) => contacto.idContacto !== idContacto)
      );
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
    }
  };

  // Función para preparar la edición de un contacto
  const handleEditarContacto = (contacto) => {
    setNuevoContacto({
      nombre: contacto.nombre,
      correo: contacto.correo,
      papel: contacto.papel,
    });
    setIdContactoEditar(contacto.idContacto); // Almacena el id para actualizar
    setEditarContacto(true);
  };

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setNuevoContacto({ nombre: '', correo: '', papel: '' });
    setEditarContacto(false);
    setIdContactoEditar(null); // Limpia el ID de edición
  };

  return (
    <footer className="bg-light text-center text-lg-start">
      <Container className="p-4">
        <Row>
          <Col lg="3" md="6" className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Contactos</h5>
            <ul className="list-unstyled">
              {Array.isArray(contactos) && contactos.length > 0 ? (
                contactos.map((contacto) => (
                  <li key={contacto.idContacto} className="mb-2">
                    <p className="mb-0 text-dark">
                      <strong>Nombre:</strong> {contacto.nombre}
                    </p>
                    <p className="mb-0 text-dark">
                      <strong>Correo:</strong> {contacto.correo}
                    </p>
                    <p className="mb-2 text-dark">
                      <strong>Papel:</strong> {contacto.papel}
                    </p>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleEliminarContacto(contacto.idContacto)}
                    >
                      Eliminar
                    </Button>{' '}
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEditarContacto(contacto)}
                    >
                      Editar
                    </Button>
                  </li>
                ))
              ) : (
                <p>No hay contactos disponibles.</p>
              )}
            </ul>
          </Col>
          <Col lg="3" md="6" className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Acceso Administrador</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/iniciar-sesion" className="text-dark">Iniciar Sesión</a>
              </li>
              <li>
                <a href="/registro" className="text-dark">Registrarse</a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5 className="text-uppercase">
              {editarContacto ? 'Actualizar Contacto' : 'Añadir Contacto'}
            </h5>
            <Form onSubmit={handleSubmitContacto}>
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el nombre"
                  value={nuevoContacto.nombre}
                  onChange={(e) =>
                    setNuevoContacto({ ...nuevoContacto, nombre: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCorreo">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingresa el correo"
                  value={nuevoContacto.correo}
                  onChange={(e) =>
                    setNuevoContacto({ ...nuevoContacto, correo: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPapel">
                <Form.Label>Papel</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el papel"
                  value={nuevoContacto.papel}
                  onChange={(e) =>
                    setNuevoContacto({ ...nuevoContacto, papel: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Button className="mt-2" variant="primary" type="submit">
                {editarContacto ? 'Actualizar' : 'Agregar'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <div className="text-center p-3 bg-dark text-white">
        © 2024 Derechos Reservados.
      </div>
    </footer>
  );
};

export default PieDePagina;
