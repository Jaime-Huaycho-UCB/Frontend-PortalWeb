import React from 'react';
import './IconosFlotantes.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const IconosFlotantes = () => {
  return (
    <div className="iconos-flotantes6">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="icono6">
        <FacebookIcon />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="icono6">
        <InstagramIcon />
      </a>
    </div>
  );
};

export default IconosFlotantes;
