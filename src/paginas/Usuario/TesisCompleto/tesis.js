import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { obtenerTesis, obtenerContenidoTesis } from '../../../librerias/PeticionesApi';
import './Tesis.css';

const Tesis = () => {
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [tesisList, setTesisList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarTesis = async () => {
      try {
        const tesisData = await obtenerTesis();
        if (tesisData.salida) {
          setTesisList(tesisData.tesises);
        }
      } catch (error) {
        console.error('Error al obtener tesis:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarTesis();
  }, []);

  const openPdfModal = async (idTesis) => {
    try {
      const response = await obtenerContenidoTesis(idTesis);
      if (response.salida) {
        setSelectedPdf(response.contenido);
        setOpenPdfViewer(true);
      } else {
        alert('Error al cargar el contenido de la tesis: ' + response.mensaje);
      }
    } catch (error) {
      console.error('Error al abrir el modal de PDF:', error);
    }
  };

  const closePdfModal = () => {
    setSelectedPdf(null);
    setOpenPdfViewer(false);
  };

  return (
    <div className="tesis-container7">
      <Typography variant="h4" className="tesis-title7">
        Biblioteca de Tesis
      </Typography>

      <div className="tesis-list">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-card7"></div>
          ))
        ) : (
          tesisList.map((tesis) => (
            <div key={tesis.id} className="tesis-card7">
              <div className="tesis-card-content7">
                <Typography variant="h6" className="tesis-title-text7">
                  {tesis.tesis.titulo}
                </Typography>
                <Typography variant="body2" className="tesis-date7">
                  Fecha de Publicación: {tesis.tesis.fechaPublicacion}
                </Typography>
                <Typography variant="body2" className="tesis-summary7">
                  Resumen: {tesis.tesis.resumen}
                </Typography>

                {tesis.estudiante && (
                  <div className="tesis-student-info7">
                    <Typography variant="subtitle2" className="tesis-student-title7">
                      Información del Estudiante
                    </Typography>
                    <Typography variant="body2">
                      Nombre: {tesis.estudiante.nombre}
                    </Typography>
                    <Typography variant="body2">
                      Nivel Académico: {tesis.estudiante.nivelAcadémico}
                    </Typography>
                    <Typography variant="body2">
                      Correo: {tesis.estudiante.correo}
                    </Typography>
                    {tesis.estudiante.foto && (
                      <img
                        src={tesis.estudiante.foto}
                        alt="Foto del Estudiante"
                        className="tesis-student-photo7"
                      />
                    )}
                  </div>
                )}

                <button
                  className="tesis-view-button7"
                  onClick={() => openPdfModal(tesis.tesis.id)}
                >
                  Ver Contenido PDF
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={openPdfViewer} onClose={closePdfModal} maxWidth="md" fullWidth>
        <DialogContent>
          <div className="pdf-viewer-header7">
            <Typography variant="h6">Visualizar Tesis</Typography>
            <IconButton onClick={closePdfModal}>
              <CloseIcon />
            </IconButton>
          </div>
          {selectedPdf && (
            <iframe
              src={`${selectedPdf}`}
              title="Visualizador de Tesis"
              width="100%"
              height="600px"
              style={{ border: 'none' }}
            ></iframe>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tesis;
