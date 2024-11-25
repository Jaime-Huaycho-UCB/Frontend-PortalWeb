import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import ArticleIcon from '@mui/icons-material/Article';
import PostAddIcon from '@mui/icons-material/PostAdd';
import MailIcon from '@mui/icons-material/Mail';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ScienceIcon from '@mui/icons-material/Science';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import './Encabezado.css';
import { AuthContext } from "../../contextos/ContextoAutenticacion.js";

const Encabezado = () => {
  const { permiso, cerrarSesion } = useContext(AuthContext);
  const permisoInt = permiso !== null ? parseInt(permiso, 10) : -1;
  const { tema, toggleTema } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className="encabezado">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenu}
          sx={{ mr: 3 }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
  <Link to="/" className="encabezado-title">
    <img
      src="/image.png" // Ruta de tu imagen
      alt="Logo Mi Portal"
      style={{
        height: '60%', // Ajusta la altura de la imagen
        width: '60%', // Mantén la proporción de la imagen
        display: 'block',
      }}
    />
  </Link>
</Box>


        <div className="navbar-links">
          {permisoInt === 1 ? (
            <>
              <Button
                startIcon={<PersonIcon />}
                className="nav-button"
                component={Link}
                to="/admin/gestion-docentes"
              >
                Docentes
              </Button>
              <Button
                startIcon={<GroupIcon />}
                className="nav-button"
                component={Link}
                to="/admin/gestion-estudiantes"
              >
                Estudiantes
              </Button>
              <Button
                startIcon={<ArticleIcon />}
                className="nav-button"
                component={Link}
                to="/admin/gestion-noticias"
              >
                Noticias
              </Button>
              <Button
                startIcon={<EventIcon />}
                className="nav-button"
                component={Link}
                to="/admin/gestion-eventos"
              >
                Eventos
              </Button>
              <Button
                startIcon={<PostAddIcon />}
                className="nav-button"
                component={Link}
                to="/admin/publicacion"
              >
                Chasqui Posta
              </Button>
              <Button
                startIcon={<MailIcon />}
                className="nav-button"
                component={Link}
                to="/admin/mensajes"
              >
                Buzón
              </Button>
              <Button
                startIcon={<PersonIcon />}
                className="nav-button"
                component={Link}
                to="/admin/perfil"
              >
                Perfil
              </Button>
            </>
          ) : permisoInt === 0 ? (
            <>
              <Button
                startIcon={<GroupIcon />}
                className="nav-button"
                component={Link}
                to="/admin/gestion-estudiantes"
              >
                Estudiantes
              </Button>
              <Button
                startIcon={<ArticleIcon />}
                className="nav-button"
                component={Link}
                to="/admin/gestion-noticias"
              >
                Noticias
              </Button>
              <Button
                startIcon={<EventIcon />}
                className="nav-button"
                component={Link}
                to="/admin/gestion-eventos"
              >
                Eventos
              </Button>
              <Button
                startIcon={<PersonIcon />}
                className="nav-button"
                component={Link}
                to="/admin/perfil"
              >
                Perfil
              </Button>
              
            </>
          ) : (
            <>
              <Button
                startIcon={<PersonIcon />}
                className="nav-button"
                component={Link}
                to="/docentes"
              >
                Docentes
              </Button>
              <Button
                startIcon={<GroupIcon />}
                className="nav-button"
                component={Link}
                to="/egresados"
              >
                Egresados
              </Button>
              <Button
                startIcon={<EventIcon />}
                className="nav-button"
                component={Link}
                to="/eventos"
              >
                Eventos
              </Button>
              <Button
                startIcon={<ArticleIcon />}
                className="nav-button"
                component={Link}
                to="/noticias"
              >
                Noticias
              </Button>
              <Button
                startIcon={<ScienceIcon />}
                className="nav-button"
                component={Link}
                to="/noticias"
              >
                Soc.Cientifica
              </Button>
              <Button
                startIcon={<ArticleIcon />}
                className="nav-button"
                component={Link}
                to="/chasqui"
              >
                Chasqui Postas
              </Button>
              <Button
                startIcon={<LocalLibraryIcon />}
                className="nav-button"
                component={Link}
                to="/Tesis"
              >
                Biblioteca Tesis
              </Button>
            </>
          )}
        <span
  className="toggle-icon"
  onClick={toggleTema}
  data-theme={tema}
>
  {tema === 'light' ? '☀️' : '🌙'}
</span>

        </div>
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
        <MenuItem component={Link} to="/admin/gestion-docentes" onClick={handleClose}>
          Docentes
        </MenuItem>
        <MenuItem component={Link} to="/admin/gestion-estudiantes" onClick={handleClose}>
          Egresados
        </MenuItem>
        <MenuItem component={Link} to="/admin/gestion-noticias" onClick={handleClose}>
          Noticias
        </MenuItem>
        <MenuItem component={Link} to="/admin/gestion-eventos" onClick={handleClose}>
          Eventos
        </MenuItem>
        <MenuItem component={Link} to="/admin/publicacion" onClick={handleClose}>
          chasqui posta
        </MenuItem>
        <MenuItem component={Link} to="/admin/mensajes" onClick={handleClose}>
          Buzon
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Encabezado;
