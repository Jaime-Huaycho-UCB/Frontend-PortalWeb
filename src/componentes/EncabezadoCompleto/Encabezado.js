// Encabezado.js
import React, { useContext,useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../../contextos/ContextoAutenticacion';
import BarraDeBusqueda from '../BarraBusquedaCompleto/BarraDeBusqueda';
import './Encabezado.css';

const Encabezado = () => {
  
  const { permiso,cerrarSesion } = useContext(AuthContext);
  const permisoInt = permiso !== null ? parseInt(permiso, 10) : -1;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [esOscuro, setEsOscuro] = useState(false); // Estado para manejar el tema
  const activarTemaOscuro = async () => {
    // Importar dinámicamente el archivo CSS del tema oscuro
    await import('../../estilos/temas/oscuro.css');
    document.body.classList.add('oscuro'); // Agregar clase oscuro
  };

  const desactivarTemaOscuro = () => {
    // "Desactivar" el tema oscuro al eliminar la clase del body
    document.body.classList.remove('oscuro');
    // Remover los efectos del archivo CSS del tema oscuro
    const link = document.querySelector(`link[href="./estilos/temas/oscuro.css"]`);
    if (link) {
      link.disabled = true; // Desactiva el archivo CSS
      link.parentNode.removeChild(link); // Lo elimina completamente
    }
  };

  const alternarTema = async () => {
    const nuevoTema = !esOscuro;
    setEsOscuro(nuevoTema);

    if (nuevoTema) {
      activarTemaOscuro();
    } else {
      desactivarTemaOscuro();
    }

    // Guardar en localStorage
    localStorage.setItem('temaOscuro', nuevoTema);
  };

  return (
    <AppBar position="static" className="encabezado">
      
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenu} sx={{ mr: 3 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component={Link} to="/" className="encabezado-title">
          Mi Portal
        </Typography>
    
        <div className="navbar-links">
          {permisoInt === 1 ? (
            <>
              <Button className="nav-button" component={Link} to="/admin/gestion-docentes">Gestión Docentes</Button>
              <Button className="nav-button" component={Link} to="/admin/gestion-estudiantes">Gestión Estudiantes</Button>
              <Button className="nav-button" component={Link} to="/admin/gestion-noticias">Gestión Noticias</Button>
              <Button className="nav-button" component={Link} to="/admin/gestion-eventos">Gestión Eventos</Button>
              <Button className="nav-button" component={Link} to="/admin/crear-usuario">Crear Usuario Superior</Button>
              <Button className="nav-button" component={Link} to="/admin/mensajes">Buzon</Button>
              <Button className="nav-button" component={Link} to="/admin/publicacion">Chasqui Postas</Button>
              <Button className="nav-button" component={Link} to="/admin/perfil">Perfil</Button>
            </>
          ) : permisoInt === 0 ? (
            <>
              <Button className="nav-button" component={Link} to="/admin/gestion-estudiantes">Gestión Estudiantes</Button>
              <Button className="nav-button" component={Link} to="/admin/gestion-noticias">Gestión Noticias</Button>
              <Button className="nav-button" component={Link} to="/admin/gestion-eventos">Gestión Eventos</Button>
              <Button className="nav-button" component={Link} to="/admin/perfil">Perfil</Button>
            </>
          ) : (
            <>
              <Button className="nav-button" component={Link} to="/docentes">Docentes</Button>
              <Button className="nav-button" component={Link} to="/egresados">Estudiantes</Button>
              <Button className="nav-button" component={Link} to="/eventos">Eventos</Button>
              <Button className="nav-button" component={Link} to="/noticias">Noticias</Button>
              <Button className="nav-button" component={Link} to="/carrera">Carrera</Button>
              <Button className="nav-button" component={Link} to="/autoridades">Autoridades</Button>
            </>
          )}
           <Button color="secondary" onClick={cerrarSesion} className="nav-button">
            Cerrar Sesión
          </Button>
        </div>
        {/* Barra de búsqueda expandible */}
        <BarraDeBusqueda />
        {/* <div>
      
      <label className="interruptor">
        <input
          type="checkbox"
          checked={esOscuro}
          onChange={alternarTema}
        />
        <span className="slider"></span>
      </label>

      <div className="contenido">
        <h2>Tema {esOscuro ? 'Oscuro' : 'Claro'}</h2>
    </div>
    </div> */}
      </Toolbar>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        {permisoInt === 1 ? [
          <MenuItem key="gestion-docentes" className="menu-item" component={Link} to="/admin/gestion-docentes" onClick={handleClose}>Gestión Docentes</MenuItem>,
          <MenuItem key="gestion-estudiantes" className="menu-item" component={Link} to="/admin/gestion-estudiantes" onClick={handleClose}>Gestión Estudiantes</MenuItem>,
          <MenuItem key="gestion-noticias" className="menu-item" component={Link} to="/admin/gestion-noticias" onClick={handleClose}>Gestión Noticias</MenuItem>,
          <MenuItem key="gestion-eventos" className="menu-item" component={Link} to="/admin/gestion-eventos" onClick={handleClose}>Gestión Eventos</MenuItem>,
          <MenuItem key="crear-usuario" className="menu-item" component={Link} to="/admin/crear-usuario" onClick={handleClose}>Crear Usuario Superior</MenuItem>,
          <MenuItem key="perfil" className="menu-item" component={Link} to="/admin/perfil" onClick={handleClose}>Perfil</MenuItem>,
        ] : permisoInt === 0 ? [
          <MenuItem key="gestion-estudiantes" className="menu-item" component={Link} to="/admin/gestion-estudiantes" onClick={handleClose}>Gestión Estudiantes</MenuItem>,
          <MenuItem key="gestion-noticias" className="menu-item" component={Link} to="/admin/gestion-noticias" onClick={handleClose}>Gestión Noticias</MenuItem>,
          <MenuItem key="gestion-eventos" className="menu-item" component={Link} to="/admin/gestion-eventos" onClick={handleClose}>Gestión Eventos</MenuItem>,
          <MenuItem key="perfil" className="menu-item" component={Link} to="/admin/perfil" onClick={handleClose}>Perfil</MenuItem>,
        ] : [
          <MenuItem key="docentes" className="menu-item" component={Link} to="/docentes" onClick={handleClose}>Docentes</MenuItem>,
          <MenuItem key="egresados" className="menu-item" component={Link} to="/egresados" onClick={handleClose}>Estudiantes</MenuItem>,
          <MenuItem key="eventos" className="menu-item" component={Link} to="/eventos" onClick={handleClose}>Eventos</MenuItem>,
          <MenuItem key="noticias" className="menu-item" component={Link} to="/noticias" onClick={handleClose}>Noticias</MenuItem>,
          <MenuItem key="carrera" className="menu-item" component={Link} to="/carrera" onClick={handleClose}>Carrera</MenuItem>,
          <MenuItem key="autoridades" className="menu-item" component={Link} to="/autoridades" onClick={handleClose}>Autoridades</MenuItem>,
        ]}
      </Menu>
    </AppBar>
  );
};

export default Encabezado;
