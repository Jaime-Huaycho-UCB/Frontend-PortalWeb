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