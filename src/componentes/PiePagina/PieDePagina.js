import React, { useState, useEffect, useContext } from "react";
import {
  obtenerContactos,
  agregarContacto,
  eliminarContacto,
  actualizarContacto,
} from "../../librerias/PeticionesApi.js"; // Ajusta la ruta según sea necesario
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";
import { AuthContext } from "../../contextos/ContextoAutenticacion.js";
import './PieDePagina.css'
import { Facebook, Tiktok, Instagram } from '@mui/icons-material';
const PieDePagina = () => {
  const { idUsuario, token, permiso } = useContext(AuthContext); // 'permiso': 1 para admin, 0 para superior
  const [contactos, setContactos] = useState([]);
  const [nuevoContacto, setNuevoContacto] = useState({
    nombre: "",
    correo: "",
    papel: "",
  });
  const [editarContacto, setEditarContacto] = useState(false); // Controla el estado de edición
  const [idContactoEditar, setIdContactoEditar] = useState(null); // Solo para actualizar/eliminar

  // Obtener contactos desde el backend
  const fetchContactos = async () => {
    try {
      const data = await obtenerContactos();
      setContactos(data.contactos || []);
    } catch (error) {
      console.error("Error al cargar contactos:", error);
    }
  };

  // Cargar contactos al montar el componente
  useEffect(() => {
    fetchContactos();
  }, []);

  // Función para agregar un nuevo contacto
  const agregarNuevoContacto = async () => {
    try {
      await agregarContacto(nuevoContacto, idUsuario, token);
      await fetchContactos(); // Actualiza la lista después de agregar
      limpiarFormulario();
    } catch (error) {
      console.error(
        "Error al agregar contacto:",
        error.response?.data || error.message
      );
    }
  };

  // Función para eliminar un contacto
  const handleEliminarContacto = async (idContacto) => {
    try {
      await eliminarContacto(idContacto, idUsuario, token);
      setContactos((prevContactos) =>
        prevContactos.filter((contacto) => contacto.idContacto !== idContacto)
      );
      fetchContactos();
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
    }
  };

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setNuevoContacto({ nombre: "", correo: "", papel: "" });
    setEditarContacto(false);
    setIdContactoEditar(null); // Limpia el ID de edición
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

// Función para preparar la edición de un contacto
const handleEditarContacto = (contacto) => {
  setNuevoContacto({
    nombre: contacto.nombre,
    correo: contacto.correo,
    papel: contacto.papel,
  });
  setIdContactoEditar(contacto.id); // Almacena el id para actualizar
  setEditarContacto(true);
};

const actualizarContactoExistente = async () => {
  try {
    console.log(nuevoContacto);
    await actualizarContacto(idContactoEditar, nuevoContacto, idUsuario, token);
    setContactos((prevContactos) =>
      prevContactos.map((contacto) =>
        contacto.id === idContactoEditar ? { ...nuevoContacto, id: idContactoEditar } : contacto
      )
    );
    limpiarFormulario();
  } catch (error) {
    console.error('Error al actualizar contacto:', error.response?.data || error.message);
  }
};
  return (
    <footer className="footer2 bg-dark text-white py-5">
  <Container>
    <Row>
      {/* Contactos */}
      <Col lg="3" md="6" className="footer-column2 mb-4">
        <h5 className="footer-title2 text-uppercase">Contactos</h5>
        <ListGroup variant="flush" className="footer-contact-list2">
          {contactos.map((contacto) => (
            <ListGroup.Item
              key={contacto.id}
              className="footer-contact-item2 bg-transparent text-white"
            >
              <p className="contact-info2 mb-1">
                <strong>Nombre:</strong> {contacto.nombre}
              </p>
              <p className="contact-info2 mb-1">
                <strong>Correo:</strong> {contacto.correo}
              </p>
              <p className="contact-info2 mb-1">
                <strong>Papel:</strong> {contacto.papel}
              </p>
              {/* Botones solo visibles si es administrador o superior */}
              {permiso >= 1 && (
                <div className="footer-contact-actions2 mt-2">
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2 footer-edit-btn2"
                    onClick={() => handleEditarContacto(contacto)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="footer-delete-btn2"
                    onClick={() => handleEliminarContacto(contacto.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>

      {/* Agregar Contactos */}
      {permiso >= 1 && (
        <Col lg="3" md="6" className="footer-column2 mb-4">
          <h5 className="footer-title2 text-uppercase">
            {editarContacto ? "Actualizar Contacto" : "Añadir Contacto"}
          </h5>
          <Form onSubmit={handleSubmitContacto} className="footer-form2">
            <Form.Group controlId="formNombre" className="form-group2">
              <Form.Label className="form-label2">Nombre</Form.Label>
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
            <Form.Group controlId="formCorreo" className="form-group2">
              <Form.Label className="form-label2">Correo</Form.Label>
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
            <Form.Group controlId="formPapel" className="form-group2">
              <Form.Label className="form-label2">Papel</Form.Label>
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
            <Button
              className="footer-submit-btn2 mt-3 w-100"
              variant="primary"
              type="submit"
            >
              {editarContacto ? "Actualizar" : "Agregar"}
            </Button>
          </Form>
        </Col>
      )}

      {/* Acceso Administrativo */}
      <Col lg="3" md="6" className="footer-column2 mb-4">
        <h5 className="footer-title2 text-uppercase">Acceso Administrativo</h5>
        <ul className="footer-admin-list2 list-unstyled">
          <li>
            <a
              href="/iniciar-sesion"
              className="footer-admin-link2 text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Iniciar Sesión
            </a>
          </li>
          <li>
            <a
              href="/registro"
              className="footer-admin-link2 text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Registrarse
            </a>
          </li>
          {permiso >= 1 && (
            <>
              <li>
                <a
                  href="/admin/dashboard"
                  className="footer-admin-link2 text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Panel de Administración
                </a>
              </li>
              <li>
                <a
                  href="/admin/config"
                  className="footer-admin-link2 text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Configuración
                </a>
              </li>
            </>
          )}
        </ul>
      </Col>

      {/* Ubicación */}
      <Col lg="3" md="6" className="footer-column2 mb-4">
        <h5 className="footer-title2 text-uppercase">Ubicación</h5>
        <div className="footer-location2">
          <p>Dirección : Av. 14 de Septiembre Nº 4807</p>
          <p>esq. calle 2 de Obrajes</p>
          <p>Telefono: + 591 (2) 2782222</p>
        </div>
      </Col>

      {/* Redes Sociales */}

      <Col lg="3" md="6" className="footer-column2">
  <h5 className="footer-title2 text-uppercase">Redes Sociales</h5>
  <ul className="footer-social-list2 list-unstyled">
    <li>
      <a
        href="https://www.facebook.com/people/Ciencias-Pol%C3%ADticas-UCB-La-Paz/100070409821200/?mibextid=ZbWKwL"
        className="footer-social-link2 text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook style={{ marginRight: '10px',width:'34px',height:'34px', color: '#4267B2' }} />
         CPO
      </a>
    </li>
    <li>
      <a
        href="https://www.facebook.com/scecpo?mibextid=ZbWKwL"
        className="footer-social-link2 text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook style={{ marginRight: '10px', width:'34px',height:'34px',color: '#4267B2' }} />
        Sociedad Cientifica
      </a>
    </li>
    <li>
      <a
        href="https://www.instagram.com/cienciaspoliticas.ucb/?igshid=OGQ5ZDc2ODk2ZA%3D%3D"
        className="footer-social-link2 text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram style={{ marginRight: '10px', width:'34px',height:'34px', color: '#C13584' }} />
        @cienciaspoliticas.ucb
      </a>
    </li>
    <li>
      <a
        href="https://www.instagram.com/sociedadcientificacpo/?igshid=ODA1NTc5OTg5Nw%3D%3D"
        className="footer-social-link2 text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram style={{ marginRight: '10px',width:'34px',height:'34px', color: '#C13584' }} />
        @sociedadcientificacpo
      </a>
    </li>
    <li>
  <a
    href="https://www.tiktok.com/@ciencias.polticas?_t=8iIZQBwV7uI&_r=1"
    className="footer-social-link2 text-white"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src='/icons8-tik-tok.svg' 
      alt="TikTok"
      style={{
        marginRight: '10px',
        width: '34px', // Ajusta el tamaño del ícono según tus necesidades
        height: '34px',
        verticalAlign: 'middle',
      }}
    />
    @ciencias.politicas
  </a>
</li>

<li>
  <a
    href="https://www.tiktok.com/@cpo_rrii?_t=8iIYIovnj09&_r=1"
    className="footer-social-link2 text-white"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src='/icons8-tik-tok.svg' 
      alt="TikTok"
      style={{
        marginRight: '10px',
        width: '34px', // Ajusta el tamaño del ícono según tus necesidades
        height: '34px',
        verticalAlign: 'middle',
      }}
    />
    @cpo_rrii
  </a>
</li>
<li>
  <a
    href="https://www.tiktok.com/@cpo_rrii?_t=8iIYIovnj09&_r=1"
    className="footer-social-link2 text-white"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src='/icons8-spotify.svg' 
      alt="TikTok"
      style={{
        marginRight: '10px',
        width: '34px', // Ajusta el tamaño del ícono según tus necesidades
        height: '34px',
        verticalAlign: 'middle',
      }}
    />
    Esto no es politica CS CPO
  </a>
</li>

  </ul>
</Col>
    </Row>
    <div className="footer-bottom2 text-center mt-4">
      <p>© 2024 Derechos Reservados. Todos los derechos reservados.</p>
    </div>
  </Container>
</footer>

  );
};

export default PieDePagina;
