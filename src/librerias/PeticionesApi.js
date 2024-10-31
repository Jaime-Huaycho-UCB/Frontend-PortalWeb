
import axios from 'axios';

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const obtenerDocentes = async (baseURL, idUsuario, token) => {
  try {
    const response = await instance.post(`${baseURL}/docente/obtener`, {
      idUsuario,
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener docentes:", error);
    throw error;
  }
};

export const agregarDocente = async (baseURL, docenteData) => {
  try {
    const response = await instance.post(`${baseURL}/docente/agregar`, docenteData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar docente:", error);
    throw error;
  }
};

export const actualizarDocente = async (baseURL, id, docenteData) => {
  try {
    const response = await instance.put(`${baseURL}/docente/actualizar`, {
      id,
      ...docenteData,
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar docente:", error);
    throw error;
  }
};

export const eliminarDocente = async (baseURL, id) => {
  try {
    const response = await instance.put(`${baseURL}/docente/eliminar`, {
      docente: id,
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar docente:", error);
    throw error;
  }
};

export const obtenerTitulos = async (baseURL) => {
  try {
    const response = await instance.get(`${baseURL}/titulo/obtener`);
    return response.data.titulos;
  } catch (error) {
    console.error("Error al obtener títulos:", error);
    throw error;
  }
};
