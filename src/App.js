import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListaDocentes from './paginas/Usuario/ListaDocentes';
import ListaEgresados from './paginas/Usuario/ListaEgresados';
import ListaEventos from './paginas/Usuario/ListaEventos';
import ListaNoticias from './paginas/Usuario/ListaNoticias';
import PaginaCarrera from './paginas/Usuario/PaginaCarrera';
import PaginaAutoridades from './paginas/Usuario/PaginaAutoridades';
import Perfil from './paginas/Usuario/Perfil';
import Encabezado from './componentes/Encabezado';
import PieDePagina from './componentes/PieDePagina';
import BarraDeBusqueda from './componentes/BarraDeBusqueda'; // Asegúrate de la ruta correcta
import './estilos/layouts/global.css';

function App() {
  return (
    <Router>
      <Encabezado />
      {/* Aquí agregas la barra de búsqueda */}
      <div className="container mt-3">
        <BarraDeBusqueda />  {/* Barra de búsqueda */}
        <Routes>
          <Route path="/docentes" element={<ListaDocentes />} />
          <Route path="/egresados" element={<ListaEgresados />} />
          <Route path="/eventos" element={<ListaEventos />} />
          <Route path="/noticias" element={<ListaNoticias />} />
          <Route path="/carrera" element={<PaginaCarrera />} />
          <Route path="/autoridades" element={<PaginaAutoridades />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/" element={<h2>Bienvenido al Portal</h2>} />
        </Routes>
      </div>
      <PieDePagina />
    </Router>
  );
}

export default App;
