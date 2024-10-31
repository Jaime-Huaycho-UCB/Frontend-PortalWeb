import React, { useState, useEffect } from 'react';
import { obtenerDocentes, crearUsuario } from '../../librerias/PeticionesApi';
import '../../estilos/AdministradorEstilos/CrearUsuarioSuperior.css';

const CrearUsuarioSuperior = () => {
  const [docentes, setDocentes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const cargarDocentes = async () => {
      try {
        const data = await obtenerDocentes();
        if (data.salida) setDocentes(data.docentes);
      } catch (error) {
        console.error("Error al cargar docentes:", error);
      }
    };

    cargarDocentes();
  }, []);

  const manejarSeleccionDocente = (docente) => {
    setDocenteSeleccionado(docente);
    setOpenDialog(true);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (docenteSeleccionado && password) {
      try {
        const nuevoUsuario = await crearUsuario(docenteSeleccionado.id, password);
        
        setUsuarios((prev) => [...prev, nuevoUsuario]);
        setMensaje(`Usuario para ${docenteSeleccionado.nombre} creado exitosamente.`);
        
        setDocenteSeleccionado(null);
        setPassword('');
        setOpenDialog(false);
      } catch (error) {
        console.error("Error al crear usuario:", error);
        setMensaje('Error al crear el usuario. Inténtalo nuevamente.');
      }
    } else {
      setMensaje('Por favor selecciona un docente y completa la contraseña.');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Crear Usuario Superior</h2>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <div className="mb-5">
        <h4>Selecciona un Docente</h4>
        <div className="row">
          {docentes.map((docente) => (
            <div className="col-md-4 mb-3" key={docente.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{docente.nombre}</h5>
                  <p className="card-text text-muted">{docente.correo}</p>
                  <p className="card-text"><small>ID: {docente.id}</small></p>
                </div>
                <div className="card-footer">
                  <button 
                    className="btn btn-outline-primary w-100" 
                    onClick={() => manejarSeleccionDocente(docente)}
                  >
                    Crear Usuario
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para crear usuario */}
      {openDialog && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Usuario para {docenteSeleccionado?.nombre}</h5>
                <button type="button" className="close" onClick={() => setOpenDialog(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={manejarEnvio}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="text"
                      className="form-control"
                      value={docenteSeleccionado?.correo || ''}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Ingresa una contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setOpenDialog(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Crear Usuario</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5">
        <h4>Usuarios Creados</h4>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CrearUsuarioSuperior;
