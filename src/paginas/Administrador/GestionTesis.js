import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Table, InputGroup, FormControl } from 'react-bootstrap';
import PDFViewer from 'pdf-viewer-reactjs';

const GestionTesis = () => {
  const [tesis, setTesis] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [activeTesis, setActiveTesis] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newTesis, setNewTesis] = useState({
    titulo: '',
    tipo: '',
    fechaPublicacion: '',
    resumen: '',
    contenido: null, 
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert("Por favor, selecciona un archivo PDF.");
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setTesis([
          ...tesis,
          { ...newTesis, contenido: base64String, id: tesis.length + 1 },
        ]);
        setSelectedFile(null);
        setShowModal(false);
        setNewTesis({ titulo: '', tipo: '', fechaPublicacion: '', resumen: '', contenido: null });
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert("No se ha seleccionado ningún archivo.");
    }
  };

  const openViewer = (tesisItem) => {
    setActiveTesis(tesisItem);
    setShowViewer(true);
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
        <Button variant="primary" onClick={() => setShowModal(true)} className="add-tesis-btn">
          Subir Tesis
        </Button>
      </div>

      {/* Tabla de tesis */}
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
                <Button variant="info" onClick={() => openViewer(item)}>Ver</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para subir tesis */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Subir Nueva Tesis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitulo">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Título de la tesis"
                value={newTesis.titulo}
                onChange={(e) => setNewTesis({ ...newTesis, titulo: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTipo" className="mt-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tipo de tesis"
                value={newTesis.tipo}
                onChange={(e) => setNewTesis({ ...newTesis, tipo: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFecha" className="mt-3">
              <Form.Label>Fecha de Publicación</Form.Label>
              <Form.Control
                type="date"
                value={newTesis.fechaPublicacion}
                onChange={(e) => setNewTesis({ ...newTesis, fechaPublicacion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formResumen" className="mt-3">
              <Form.Label>Resumen</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Resumen de la tesis"
                value={newTesis.resumen}
                onChange={(e) => setNewTesis({ ...newTesis, resumen: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mt-3">
              <Form.Label>Selecciona un archivo PDF</Form.Label>
              <Form.Control type="file" accept="application/pdf" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleUpload}>Subir</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de visor de PDF */}
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
    </div>
  );
};

export default GestionTesis;
