// src/librerias/PeticionesApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';  

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const obtenerDocentes = async (idUsuario, token) => {
  try {
    const response = await instance.post('/docente/obtener', { idUsuario, token });
    return response.data;
  } catch (error) {
    console.error("Error al obtener docentes:", error);
    throw error;
  }
};

export const obtenerDocentesTodo = async (idUsuario, token) => {
    try {
      const response = await instance.post('/docente/obtener/todo', { idUsuario, token });
      return response.data;
    } catch (error) {
      console.error("Error al obtener docentes:", error);
      throw error;
    }
  };
  

export const agregarDocente = async (docenteData) => {
  try {
    const response = await instance.post('/docente/agregar', docenteData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar docente:", error);
    throw error;
  }
};

export const actualizarDocente = async (id, docenteData) => {
  try {
    const response = await instance.put('/docente/actualizar', { id, ...docenteData });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar docente:", error);
    throw error;
  }
};

export const eliminarDocente = async (id) => {
  try {
    const response = await instance.put('/docente/eliminar', { docente: id });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar docente:", error);
    throw error;
  }
};

export const obtenerTitulos = async () => {
  try {
    const response = await instance.get('/titulo/obtener');
    return response.data.titulos;
  } catch (error) {
    console.error("Error al obtener títulos:", error);
    throw error;
  }
};
export const crearUsuario = async (idDocente, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/usuario/crear`, {
        idDocente,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  };
  export const obtenerUsuarios = async (idUsuario, token) => {
    try {
      const response = await instance.post('/usuario/obtener', { idUsuario, token });
      return response.data;
    } catch (error) {
      console.error("Error al obtener docentes:", error);
      throw error;
    }
  };

  

export const manejarCambioFoto = (e, setFotoBase64) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoBase64(reader.result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  } else {
    setFotoBase64('');
  }
};
export const agregarEvento = async (EventoData) => {
  try {
    const response = await instance.post('/Evento/agregar', EventoData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar docente:", error);
    throw error;
  }
};
export const obtenerEventos = async (idUsuario, token) => {
  try {
    const response = await instance.post('/evento/obtener', { idUsuario, token });
    return response.data;
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    throw error;
  }
};
