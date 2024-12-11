import React, { useState, useEffect, useContext } from 'react';
import { obtenerPublicaciones } from '../../../librerias/PeticionesApi';
import { AuthContext } from '../../../contextos/ContextoAutenticacion';
import './Chasqui.css';
import { Container, Row, Col, Card, Form, FormControl, Button } from 'react-bootstrap';

const Publicaciones = () => {
  const { idUsuario, token } = useContext(AuthContext);
  const [publicaciones, setPublicaciones] = useState([]);
  const [contenidoExpandido, setContenidoExpandido] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [publicacionesFiltradas, setPublicacionesFiltradas] = useState([]);

  // Obtener publicaciones desde el backend
  const fetchPublicaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerPublicaciones(0);
      const publicaciones = data.publicaciones || [];
      setPublicaciones(publicaciones);
      setPublicacionesFiltradas(publicaciones); // Inicializar las publicaciones filtradas
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      setError('No se pudieron cargar las publicaciones. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicaciones(0);
  }, []);

  // Filtrar publicaciones en tiempo real
  useEffect(() => {
    if (!busqueda.trim()) {
      setPublicacionesFiltradas(publicaciones); // Mostrar todas si no hay búsqueda
    } else {
      const filtradas = publicaciones.filter((pub) =>
        pub.numero && pub.numero.toString().includes(busqueda)
      );
      setPublicacionesFiltradas(filtradas);
    }
  }, [busqueda, publicaciones]);

  // Alternar expansión de contenido
  const toggleExpandirContenido = (id) => {
    setContenidoExpandido((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="facebook-container2">
      <Form className="d-flex mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <FormControl
          type="search"
          placeholder="Buscar por número..."
          className="me-2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </Form>
      {loading ? (
        <div className="facebook-loading2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="facebook-skeleton2"></div>
          ))}
        </div>
      ) : error ? (
        <div className="facebook-error2">{error}</div>
      ) : (
        publicacionesFiltradas.map((publicacion) => (
          <div className="facebook-post2" key={publicacion.id}>
            {/* Encabezado */}
            <div className="facebook-header2">
              <div className="facebook-avatar2">
                <img src="/CPO - V.png" alt="Avatar" />
              </div>
              <div>
                <h4 className="facebook-author2">{publicacion.redactor}</h4>
                <h4 className="facebook-author2">{publicacion.nombre}</h4>
              </div>
            </div>

            {/* Contenido */}
            <div className="facebook-content2">
              <p>
                {contenidoExpandido[publicacion.id] || publicacion.contenido.length <= 150
                  ? publicacion.contenido
                  : `${publicacion.contenido.substring(0, 150)}...`}
              </p>
              {publicacion.contenido.length > 150 && (
                <button
                  className="facebook-toggle2"
                  onClick={() => toggleExpandirContenido(publicacion.id)}
                >
                  {contenidoExpandido[publicacion.id] ? 'Ver menos' : 'Ver más'}
                </button>
              )}
              {publicacion.foto && (
                <img
                  src={publicacion.foto}
                  alt="Publicación"
                  className="facebook-image2"
                />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Publicaciones;
