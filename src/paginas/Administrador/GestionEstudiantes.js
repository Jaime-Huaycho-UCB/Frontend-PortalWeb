import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Card } from 'react-bootstrap';
import { obtenerEstudiantes, agregarEstudiante, actualizarEstudiante, eliminarEstudiante, obtenerNivelesAcademicos } from '../../librerias/PeticionesApi';
import '../../estilos/AdministradorEstilos/GestionEstudiantes.css';

const GestionEstudiantes = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nivelesAcademicos, setNivelesAcademicos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: '',
    nivelAcademico: '',
    correo: '',
    foto: null,
    agregarTesis: false,
    tesis: {
      titulo: '',
      tipo: '',
      fechaPublicacion: '',
      resumen: '',
      contenido: null,
    }
  });
  useEffect(() => {
    const cargarEstudiantes = async () => {
      try {
        const respuesta = await obtenerEstudiantes();
        setEstudiantes(respuesta.salida ? respuesta.estudiantes : []);
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
        setEstudiantes([]);
      }
    };
  
    const cargarNivelesAcademicos = async () => {
      try {
        const respuesta = await obtenerNivelesAcademicos();
        setNivelesAcademicos(Array.isArray(respuesta) ? respuesta : []);
      } catch (error) {
        console.error("Error al cargar niveles académicos:", error);
        setNivelesAcademicos([]);
      }
    };
  
    cargarEstudiantes();
    cargarNivelesAcademicos();
  }, []);
  
  
  
  const handleGuardarEstudiante = async () => {
    if (estudianteSeleccionado) {
      const estudianteActualizado = await actualizarEstudiante(estudianteSeleccionado.id, nuevoEstudiante);
      setEstudiantes(estudiantes.map(est => (est.id === estudianteActualizado.id ? estudianteActualizado : est)));
    } else {
      const estudianteAgregado = await agregarEstudiante(nuevoEstudiante);
      setEstudiantes([...estudiantes, estudianteAgregado]);
    }
    setNuevoEstudiante({ nombre: '', nivelAcademico: '', correo: '', foto: null, agregarTesis: false, tesis: {} });
    setMostrarModal(false);
    setEstudianteSeleccionado(null);
  };

  const handleEditarEstudiante = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setNuevoEstudiante(estudiante);
    setMostrarModal(true);
  };

  const handleSubirImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onloadend = () => {
        setNuevoEstudiante({ ...nuevoEstudiante, foto: lector.result.split(',')[1] });
      };
      lector.readAsDataURL(archivo);
    }
  };

  const handleSubirArchivoPDF = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type === 'application/pdf') {
      const lector = new FileReader();
      lector.onloadend = () => {
        setNuevoEstudiante({ 
          ...nuevoEstudiante, 
          tesis: { ...nuevoEstudiante.tesis, contenido: lector.result.split(',')[1] } 
        });
      };
      lector.readAsDataURL(archivo);
    } else {
      alert("Por favor, selecciona un archivo PDF.");
    }
  };

  const handleEliminarEstudiante = async (id) => {
    await eliminarEstudiante(id);
    setEstudiantes(estudiantes.filter(est => est.id !== id));
  };

  return (
    <div className="gestion-estudiantes-container">
      <div className="header">
        <h2>Gestión de Estudiantes</h2>
        <Button variant="primary" onClick={() => setMostrarModal(true)} className="add-estudiante-btn">Agregar Estudiante</Button>
      </div>

      <div className="estudiantes-grid">
        {estudiantes.map((estudiante) => (
          <Card key={estudiante.id} className="estudiante-card">
            {estudiante.foto && (
              <Card.Img variant="top" src={`data:image/png;base64,${estudiante.foto}`} alt="Foto del estudiante" />
            )}
            <Card.Body>
              <Card.Title>{estudiante.nombre}</Card.Title>
              <Card.Text>
                Nivel Académico: {estudiante.nivelAcademico}<br />
                Correo: {estudiante.correo}<br />
              </Card.Text>
              <Button variant="info" onClick={() => handleEditarEstudiante(estudiante)}>Editar</Button>
              <Button variant="danger" onClick={() => handleEliminarEstudiante(estudiante.id)} className="ms-2">Eliminar</Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{estudianteSeleccionado ? "Editar Estudiante" : "Agregar Nuevo Estudiante"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre del estudiante"
                value={nuevoEstudiante.nombre}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formNivelAcademico" className="mt-3">
              <Form.Label>Nivel Académico</Form.Label>
              <Form.Control
                as="select"
                value={nuevoEstudiante.nivelAcademico}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, nivelAcademico: e.target.value })}
              >
                <option value="">Selecciona el nivel</option>
                {nivelesAcademicos.map((nivel) => (
                  <option key={nivel.id} value={nivel.nombre}>{nivel.nombre}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCorreo" className="mt-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa el correo"
                value={nuevoEstudiante.correo}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, correo: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFoto" className="mt-3">
              <Form.Label>Foto del Estudiante</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleSubirImagen}
              />
            </Form.Group>
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
                <Form.Group controlId="formTituloTesis" className="mt-3">
                  <Form.Label>Título de la Tesis</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Título de la tesis"
                    value={nuevoEstudiante.tesis.titulo}
                    onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, tesis: { ...nuevoEstudiante.tesis, titulo: e.target.value } })}
                  />
                </Form.Group>
                <Form.Group controlId="formTipoTesis" className="mt-3">
                  <Form.Label>Tipo de Tesis</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tipo de tesis"
                    value={nuevoEstudiante.tesis.tipo}
                    onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, tesis: { ...nuevoEstudiante.tesis, tipo: e.target.value } })}
                  />
                </Form.Group>
                <Form.Group controlId="formFechaPublicacionTesis" className="mt-3">
                  <Form.Label>Fecha de Publicación</Form.Label>
                  <Form.Control
                    type="date"
                    value={nuevoEstudiante.tesis.fechaPublicacion}
                    onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, tesis: { ...nuevoEstudiante.tesis, fechaPublicacion: e.target.value } })}
                  />
                </Form.Group>
                <Form.Group controlId="formResumenTesis" className="mt-3">
                  <Form.Label>Resumen</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Resumen de la tesis"
                    value={nuevoEstudiante.tesis.resumen}
                    onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, tesis: { ...nuevoEstudiante.tesis, resumen: e.target.value } })}
                  />
                </Form.Group>
                <Form.Group controlId="formArchivoTesis" className="mt-3">
                  <Form.Label>Contenido de la Tesis (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="application/pdf"
                    onChange={handleSubirArchivoPDF}
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleGuardarEstudiante}>
            {estudianteSeleccionado ? "Actualizar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionEstudiantes;
