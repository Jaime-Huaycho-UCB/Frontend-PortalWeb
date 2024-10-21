import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import '../estilos/componentesEstilos/BarraDeBusqueda.css'; 

const BarraDeBusqueda = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Buscando: ${query}`);
  };

  return (
    <Form className="barra-de-busqueda" onSubmit={handleSearch}> 
      <FormControl
        type="search"
        placeholder="Buscar"
        className="input-busqueda" 
        aria-label="Buscar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button className="boton-busqueda" type="submit">Buscar</Button> 
    </Form>
  );
};

export default BarraDeBusqueda;
