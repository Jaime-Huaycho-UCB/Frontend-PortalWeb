import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Table } from 'react-bootstrap';
import { obtenerDocentes, crearUsuario, obtenerUsuarios } from '../../librerias/PeticionesApi';
import '../../estilos/AdministradorEstilos/CrearUsuarioSuperior.css';
import { AuthContext } from '../../contextos/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';

const CrearUsuarioSuperior = () => {
  const [docentes, setDocentes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { idUsuario, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { cerrarSesion } = useContext(AuthContext); 
  
  const cargarDocentes = useCallback(async () => {
    try {
      const response = await obtenerDocentes(idUsuario, token);
      if (!response.salida) {
        if(response.mensaje==='TKIN'){
          cerrarSesion(); 
          navigate('/iniciar-sesion'); 
          return;
        }else{
          console.error(response.mensaje)
        }
      }
      setDocentes(response?.docentes || []);
    } catch (error) {
      console.error("Error al cargar docentes:", error);
    }
  }, [idUsuario, token,cerrarSesion,navigate]); 

  const cargarUsuarios = useCallback(async () => {
    try {
      const usuariosData = await obtenerUsuarios(idUsuario, token);
      if (usuariosData.salida) {
        setUsuarios(usuariosData.usuarios);
        console.log(usuariosData.usuarios);
      } else {
          if(usuariosData.mensaje==='TKIN'){
          cerrarSesion();
          navigate('/iniciar-sesion');
          return;
        
          }else{
            console.log(usuariosData.mensaje);
          }
        }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  }, [idUsuario, token,cerrarSesion,navigate]); // Memoriza `cargarUsuarios` para evitar ejecuciones innecesarias

  useEffect(() => {
    console.log("Cargando docentes...");
    cargarDocentes();

    console.log("Cargando usuarios...");
    cargarUsuarios();
  }, [cargarDocentes, cargarUsuarios]); // Incluye las funciones en las dependencias

  const manejarSeleccionDocente = (docente) => {
    setDocenteSeleccionado(docente);
    setOpenDialog(true);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (docenteSeleccionado && password) {
      try {
        const nuevoUsuario = await crearUsuario(docenteSeleccionado.id, password,idUsuario,token);
        if(!nuevoUsuario.salida){
          if(nuevoUsuario.mensaje==="TKIN"){
            cerrarSesion();
            navigate('/iniciar-sesion');
            return;
          }else{
            console.log(nuevoUsuario.mensaje);
          }
        }
        setMensaje(`Usuario para ${docenteSeleccionado.nombre} creado exitosamente.`);
        await cargarUsuarios();

        setDocentes((prev) => prev.filter((docente) => docente.id !== docenteSeleccionado.id));
        setDocenteSeleccionado(null);
        setPassword('');
        setOpenDialog(false);
      } catch (error) {
        console.error("Error al crear usuario:", error);
        setMensaje('Error al crear el usuario. Inténtalo nuevamente.');
      }
    } else {
      setMensaje('Por favor selecciona un docente y completa la contraseña.');
    }

    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Crear Usuario Superior</h2>

      {mensaje && <Alert variant="info">{mensaje}</Alert>}

      <div className="mb-5">
        <h4>Selecciona un Docente</h4>
        <Row>
          {Array.isArray(docentes) && docentes.map((docente) => (
            <Col md={4} className="mb-3" key={docente.id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{docente.nombre}</Card.Title>
                  <Card.Text className="text-muted">{docente.correo}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => manejarSeleccionDocente(docente)}
                    className="w-100"
                  >
                    Crear Usuario
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Modal show={openDialog} onHide={() => setOpenDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Usuario para {docenteSeleccionado?.nombre}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={manejarEnvio}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={docenteSeleccionado?.correo || ''}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa una contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Crear Usuario</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <div className="mt-5">
        <h4>Usuarios Creados</h4>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(usuarios) && usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default CrearUsuarioSuperior;
