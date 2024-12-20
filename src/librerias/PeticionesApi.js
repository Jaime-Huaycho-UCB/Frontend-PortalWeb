// src/librerias/PeticionesApi.js
import axios from 'axios';
import Swal from 'sweetalert2';
//  const BASE_URL = 'https://backend-portalweb-production.up.railway.app';  
 const BASE_URL = 'http://192.168.1.132:8000';  

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

export const obtenerDocentesTodo = async (idTitulo) => {
  try {
    const response = await instance.get(`/docente/obtener/todo/${idTitulo}`);

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
      // Verificar si el archivo es PNG
      if (file.type === 'image/png') {
        Swal.fire({
          title: 'Formato no permitido',
          text: 'No se permiten imágenes en formato PNG. Por favor, selecciona otro formato (JPEG, WEBP, etc.).',
          icon: 'error',
          confirmButtonText: 'Cerrar',
        });
        return; // Detener el procesamiento si es PNG
      }
  
      // Procesar el archivo si no es PNG
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBase64(reader.result.split(',')[1]); // Convertir a base64 si es necesario
      };
      reader.readAsDataURL(file);
    } else {
      setFotoBase64(''); // Reiniciar si no hay archivo seleccionado
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

export const obtenerEventos = async (idEvento) => {
  try {
    const response = await instance.get(`/evento/obtener/${idEvento}`);

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
    const response = await instance.put(`/noticia/eliminar`, { idNoticia,idUsuario, token  });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar noticia:", error);
    throw error;
  }
};
// Obtener estudiantes
export const obtenerEstudiantes = async (idSemestre) => {
  try {
    const response = await instance.get(`/estudiante/obtener/${idSemestre}`);

    return response.data;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    throw error;
  }
};

// Obtener niveles académicos
export const obtenerNivelesAcademicos = async () => {
  try {
    const response = await instance.get('/estudiante/nivelAcademico/obtener');
    return response.data;
  } catch (error) {
    console.error("Error al obtener niveles académicos:", error);
    return [];
  }
};

// Agregar estudiante
export const agregarEstudiante = async (estudianteData, idUsuario, token) => {
  try {
    const response = await instance.post('/estudiante/agregar', { ...estudianteData, idUsuario, token });
    return response.data;
  } catch (error) {
    console.error("Error al agregar estudiante:", error);
    throw error;
  }
};

// Actualizar estudiante
export const actualizarEstudiante = async (idEstudiante, estudianteData, idUsuario, token) => {
  try {
    const response = await instance.put(`/estudiante/actualizar`, { idEstudiante, ...estudianteData, idUsuario, token });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar estudiante:", error);
    throw error;
  }
};

// Eliminar estudiante
export const eliminarEstudiante = async (idEstudiante, idUsuario, token) => {
  try {
    const response = await instance.put(`/estudiante/eliminar`, { idEstudiante, idUsuario, token },
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar estudiante:", error);
    throw error;
  }
};
export const obtenerTesis = async () => {
  try {
    const response = await instance.get('/estudiante/tesis/obtener/todo');
    return response.data;
  } catch (error) {
    console.error("Error al obtener las tesis:", error);
    throw error;
  }
};
export const eliminarTesis = async (idTesis,idEstudiante,idUsuario,token) => {
  try {
    const response = await instance.put(`/estudiante/tesis/eliminar`,{idTesis,idEstudiante,idUsuario,token});
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la tesis:", error);
    throw error;
  }
};
export const agregarTesis = async (tesisData, idUsuario, token, idEstudiante) => {
  try {
    const response = await instance.post('/estudiante/tesis/ingresar', { 
      idUsuario, 
      token, 
      idEstudiante, 
      ...tesisData 
    });
    return response.data;
  } catch (error) {
    console.error("Error al agregar la tesis:", error);
    throw error;
  }
};
export const obtenerContenidoTesis = async (idTesis) => {
  try {
    const response = await instance.get(`/estudiante/tesis/obtener/contenido/${idTesis}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el contenido de la tesis:", error);
    throw error;
  }
};
export const obtenerPerfil = async (idDocente,idUsuario,token) => {
  try {
    const response = await instance.post(`/docente/obtener/informacion`,{idDocente,idUsuario,token});
    return response.data;
  } catch (error) {
    console.error("Error al obtener los datos del docente:", error);
    throw error;
  }
};
// PeticionesApi.js

export const agregarPaper = async (paperData, idDocente, idUsuario, token) => {
  try {
    const response = await instance.post('/docente/papers/ingresar', {
      ...paperData,
      idDocente,
      idUsuario,
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Error al agregar el paper:", error);
    throw error;
  }
};

export const obtenerPapers = async (idDocente) => {
  try {
    const response = await instance.get(`/docente/papers/obtener/${idDocente}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los papers:", error);
    throw error;
  }
};
// Obtener contactos
export const obtenerContactos = async () => {
  try {
    const response = await instance.get('/contacto/obtener');
    return response.data;
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    throw error;
  }
};

// Agregar un contacto
export const agregarContacto = async (contactoData, idUsuario, token) => {
  try {
    const response = await instance.post('/contacto/agregar', { ...contactoData, idUsuario, token });
    return response.data;
  } catch (error) {
    console.error('Error al agregar contacto:', error);
    throw error;
  }
};
// Eliminar un contacto (ID en el cuerpo)
export const eliminarContacto = async (idContacto, idUsuario, token) => {
  try {
    const response = await instance.put('/contacto/eliminar', {idContacto, idUsuario, token },);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    throw error;
  }
};

export const actualizarContacto = async (idContacto, contactoData, idUsuario, token) => {
  try {
    const response = await instance.put('/contacto/actualizar', {
      idContacto,
      ...contactoData,
      idUsuario,
      token,
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar contacto:', error);
    throw error;
  }
};
export const enviarSolicitud = async (solicitudData) => {
  try {
    const response = await instance.post('/solicitud/enviar', solicitudData);
    return response.data;
  } catch (error) {
    console.error('Error al enviar la solicitud:', error.response?.data || error.message);
    throw error;
  }
};
// Función para obtener mensajes
export const obtenerMensajes = async (idUsuario, token) => {
  try {
    const response = await instance.post('/solicitud/obtener', {
      idUsuario,
      token,
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener mensajes:', error.response?.data || error.message);
    throw error;
  }
};

// Función para eliminar un mensaje
export const eliminarMensaje = async (idSolicitud, idUsuario, token) => {
  try {
    const response = await instance.put(`/solicitud/eliminar/`, {idSolicitud,
      idUsuario,
      token,
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar mensaje:', error.response?.data || error.message);
    throw error;
  }
};
export const agregarPublicacion = async (publicacionData, idUsuario, token) => {
  try {
    const response = await instance.post('/publicacion/agregar', { ...publicacionData, idUsuario, token });
    return response.data;
  } catch (error) {
    console.error('Error al agregar publicación:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerPublicaciones = async (Numero) => {
  try {
    const response = await instance.get(`/publicacion/obtener/${Numero}`);

    return response.data;
  } catch (error) {
    console.error('Error al obtener publicaciones:', error.response?.data || error.message);
    throw error;
  }
};
export const actualizarPublicacion = async ( idPublicacion,publicacionData, idUsuario, token) => {
  try {
    const response = await instance.put('/publicacion/actualizar', {
      idPublicacion,
      ...publicacionData,
      idUsuario,
      token,
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar publicación:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'No se pudo actualizar la publicación.');
  }
};

export const eliminarPublicacion = async (idPublicacion, idUsuario, token) => {
  try {
    const response = await instance.put('/publicacion/eliminar', {
      idPublicacion
      ,
      idUsuario,
      token,
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar publicación:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'No se pudo eliminar la publicación.');
  }
};

export const obtenerFiltros = async () => {
  try {
    const response = await instance.get("/estudiante/semestre/obtener");
    return response.data; // Retorna los datos obtenidos de la API
  } catch (error) {
    console.error("Error al obtener filtros:", error);
    throw error; // Propaga el error si necesitas manejarlo en otro lugar
  }
};
