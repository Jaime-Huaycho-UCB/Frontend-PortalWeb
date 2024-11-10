import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import PDFViewer from 'pdf-viewer-reactjs';
import { obtenerTesis, eliminarTesis } from '../../librerias/PeticionesApi';
import '../../estilos/AdministradorEstilos/GestionTesis.css';
import { AuthContext } from '../../contextos/ContextoAutenticacion';
import { useNavigate } from 'react-router-dom';

const GestionTesis = () => {
  const { idUsuario, token, cerrarSesion } = useContext(AuthContext);
  const [tesis, setTesis] = useState([]);
  const [showViewer, setShowViewer] = useState(false);
  const [activeTesis, setActiveTesis] = useState(null);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [tesisIdEliminar, setTesisIdEliminar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarTesis = async () => {
      try {
        const data = await obtenerTesis();
        if (data.salida) {
          setTesis(data.tesis);
        }
      } catch (error) {
        console.error("Error al obtener las tesis:", error);
      }
    };

    cargarTesis();
  }, [idUsuario, token, cerrarSesion, navigate]);

  const iniciarVisualizacion = (tesisItem) => {
    setActiveTesis(tesisItem);
    setShowViewer(true);
  };

  const iniciarEliminacion = (id) => {
    setTesisIdEliminar(id);
    setShowEliminarModal(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const response = await eliminarTesis(tesisIdEliminar, idUsuario, token);
      if (!response.salida) {
        if (response.mensaje === 'TKIN') {
          cerrarSesion();
          navigate('/iniciar-sesion');
          return;
        } else {
          console.error(response.mensaje);
        }
      }
      setTesis(tesis.filter((t) => t.id !== tesisIdEliminar));
      setShowEliminarModal(false);
      setTesisIdEliminar(null);
    } catch (error) {
      console.error("Error al eliminar la tesis:", error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${activeTesis.contenido}`;
    link.download = `${activeTesis.titulo}.pdf`;
    link.click();
  };

  return (
    <div className="gestion-tesis-container">
      <div className="header">
        <h2>Gestión de Tesis</h2>
      </div>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th>Fecha de Publicación</th>
            <th>Resumen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tesis.map((item) => (
            <tr key={item.id}>
              <td>{item.titulo}</td>
              <td>{item.tipo}</td>
              <td>{item.fechaPublicacion}</td>
              <td>{item.resumen}</td>
              <td>
                <Button variant="info" onClick={() => iniciarVisualizacion(item)}>Ver</Button>
                <Button variant="danger" onClick={() => iniciarEliminacion(item.id)} className="ms-2">Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para visualización de PDF */}
      {activeTesis && (
        <Modal show={showViewer} onHide={() => setShowViewer(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{activeTesis.titulo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PDFViewer
              document={{
                base64: activeTesis.contenido,
              }}
              scale={1.5}
              hideRotation
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewer(false)}>Cerrar</Button>
            <Button variant="primary" onClick={handleDownload}>Descargar</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal de confirmación para eliminación */}
      <Modal show={showEliminarModal} onHide={() => setShowEliminarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar esta tesis?</Modal.Body>
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

export default GestionTesis;
