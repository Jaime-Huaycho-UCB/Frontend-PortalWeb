// BarraDeBusqueda.js
import React, { useState } from 'react';
import { IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './BarraDeBusqueda.css';

const BarraDeBusqueda = () => {
  const [expandido, setExpandido] = useState(false);
  const [query, setQuery] = useState('');

  const handleExpandir = () => setExpandido(!expandido);
  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Buscando: ${query}`);
  };

  return (
    <form className={`barra-de-busqueda ${expandido ? 'expandido' : ''}`} onSubmit={handleSearch}>
      <IconButton onClick={handleExpandir} className="boton-lupa">
        <SearchIcon />
        {!expandido && <span className="texto-buscar">Buscar</span>}
      </IconButton>
      <InputBase
        className="input-busqueda"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ display: expandido ? 'inline-flex' : 'none' }}
      />
    </form>
  );
};

export default BarraDeBusqueda;
