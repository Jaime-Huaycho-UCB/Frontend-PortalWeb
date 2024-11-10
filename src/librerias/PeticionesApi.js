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

export const obtenerDocentesTodo = async () => {
  try {
    const response = await instance.get('/docente/obtener/todo');
    return response.data;
  } catch (error) {
    console.error("Error al obtener docentes:", error);
    throw error;
  }
};

  
  export const agregarDocente = async (docenteData, idUsuario, token) => {
    try {
      console.log(token)
      console.log(idUsuario)
      const response = await instance.post('/docente/agregar', { ...docenteData, idUsuario, token });
      return response.data;
    } catch (error) {
      console.error("Error al agregar docente:", error);
      throw error;
    }
  };
  
export const actualizarDocente = async (id, docenteData,idUsuario,token) => {
  try {
    const response = await instance.put('/docente/actualizar', { id, ...docenteData,idUsuario, token });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar docente:", error);
    throw error;
  }
};

export const eliminarDocente = async (id,idUsuario,token) => {
  try {
    const response = await instance.put('/docente/eliminar', { docente: id, idUsuario, token });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar docente:", error);
    throw error;
  }
};

export const obtenerTitulos = async () => {
  try {
    const response = await instance.get('/docente/titulo/obtener');
    return response.data.titulos;
  } catch (error) {
    console.error("Error al obtener títulos:", error);
    throw error;
  }
};
export const crearUsuario = async (idDocente, password,idUsuario,token) => {
    try {
      const response = await axios.post(`${BASE_URL}/usuario/crear`, {
        idDocente,
        password,
        idUsuario,
        token,
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
export const agregarEvento = async (eventoData, idUsuario, token) => {
  try {
    const response = await instance.post('/evento/agregar', { ...eventoData, idUsuario, token });
    return response.data;
  } catch (error) {
    console.error("Error al agregar evento:", error);
    throw error;
  }
};

export const obtenerEventos = async () => {
  try {
    const response = await instance.get('/evento/obtener');
    return response.data;
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    throw error;
  }
};

export const eliminarEvento = async (id,idUsuario,token) => {
  try {
    const response = await instance.put('/evento/eliminar', { evento: id , idUsuario,token});
    return response.data;
  } catch (error) {
    console.error("Error al eliminar docente:", error);
    throw error;
  }
};
export const actualizarEvento = async (idEvento, eventoData, idUsuario, token) => {
  try {
    const response = await instance.put(`/evento/actualizar`, {idEvento, ...eventoData, idUsuario, token });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    throw error;
  }
};

export const obtenerNoticias = async () => {
  try {
    const response = await instance.get('/noticia/obtener');
    return response.data;
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    throw error;
  }
};

export const agregarNoticia = async (noticiaData, idUsuario, token) => {
  try {
    const response = await instance.post('/noticia/agregar', { ...noticiaData, idUsuario, token });
    return response.data;
  } catch (error) {
    console.error("Error al agregar noticia:", error);
    throw error;
  }
};

export const actualizarNoticia = async (idNoticia, noticiaData, idUsuario, token) => {
  try {
    const response = await instance.put(`/noticia/actualizar`, { idNoticia,...noticiaData, idUsuario, token });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar noticia:", error);
    throw error;
  }
};

export const eliminarNoticia = async (idNoticia, idUsuario, token) => {
  try {
    const response = await instance.put(`/noticia/eliminar`, { data:idNoticia,idUsuario, token  });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar noticia:", error);
    throw error;
  }
};
// Obtener niveles académicos
export const obtenerNivelesAcademicos = async () => {
  try {
    const response = await instance.get('/estudiante/niveles');
    return response.data;
  } catch (error) {
    console.error("Error al obtener niveles académicos:", error);
    return [];
  }
};

// Obtener estudiantes
export const obtenerEstudiantes = async () => {
  try {
    const response = await instance.get('/estudiante/obtener');
    return response.data;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    throw error;
  }
};

// Agregar estudiante
export const agregarEstudiante = async (estudianteData,idUsuario,token) => {
  try {
    const response = await instance.post('/estudiante/agregar', { ...estudianteData, idUsuario, token });
    return response.data;
  } catch (error) {
    console.error("Error al agregar estudiante:", error);
    throw error;
  }
};

// Actualizar estudiante
export const actualizarEstudiante = async (idEstudiante, estudianteData,idUsuario,token) => {
  try {
    const response = await instance.put(`/estudiante/actualizar`,{ idEstudiante,...estudianteData,idUsuario,token});
    return response.data;
  } catch (error) {
    console.error("Error al actualizar estudiante:", error);
    throw error;
  }
};

// Eliminar estudiante
export const eliminarEstudiante = async (idEstudiante,idUsuario,token) => {
  try {
    const response = await instance.delete(`/estudiante/eliminar`, { data:idEstudiante,idUsuario, token  });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar estudiante:", error);
    throw error;
  }
};
