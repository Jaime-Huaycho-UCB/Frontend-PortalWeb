import React, { useState, useEffect, useCallback } from "react";
import "./ListaNoticias.css";
import { obtenerNoticias } from "../../../librerias/PeticionesApi";

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarNoticias = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerNoticias();
      if (data.salida) {
        setNoticias(data.noticias ||[]);
      }
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarNoticias();
  }, [cargarNoticias]);

  return (
    <div className="noticias-container9">
      <header className="noticias-header9">
        <h1 className="noticias-logo9">🌟 Noticias Profesionales 🌟</h1>
      </header>

      <main className="noticias-lista9">
        {loading
          ? Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="skeleton-card2" />
              ))
          : noticias.map((noticia, index) => (
              <div key={index} className="noticia-recuadro9">
                <div className="noticia-texto9">
                  <h2 className="noticia-titulo9">{noticia.titulo}</h2>
                  <h2 className="noticia-autor9">{noticia.redactor}</h2>
                  
                  <p className="noticia-fecha9">{noticia.fechaPublicacion}</p>
                  <p className="noticia-contenido9">{noticia.noticia}</p>
                </div>
                <div className="noticia-imagen-container9">
                  <img
                    src={noticia.fotoNoticia}
                    alt={noticia.titulo}
                    className="noticia-imagen9"
                  />
                </div>
              </div>
            ))}
      </main>
    </div>
  );
};

export default Noticias;
