import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

const CambiarContrasena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const handleCambiarContrasena = async () => {
    if (!nuevaContrasena || !confirmarContrasena) {
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todos los campos.",
        icon: "error",
        confirmButtonText: "Reintentar",
      });
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden.",
        icon: "error",
        confirmButtonText: "Reintentar",
      });
      return;
    }

    try {
      const response = await axios.post("http://192.168.1.132:8000/usuario/cambiar/contrasena", {
        correo: email,
        contrasena: nuevaContrasena,
      });
      console.log(nuevaContrasena);

      if (response.data.salida) {
        Swal.fire({
          title: "¡Éxito!",
          text: response.data.mensaje,
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          navigate("/iniciar-sesion"); // Redirige a la página de inicio de sesión
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.mensaje,
          icon: "error",
          confirmButtonText: "Reintentar",
        });
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al procesar su solicitud. Intente de nuevo más tarde.",
        icon: "error",
        confirmButtonText: "Reintentar",
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#f8f9fa",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
        Cambiar Contraseña
      </Typography>
      <Typography variant="body1" sx={{ color: "#666", marginBottom: "20px" }}>
        Introduzca su nueva contraseña.
      </Typography>
      <TextField
        fullWidth
        type="password"
        label="Nueva Contraseña"
        value={nuevaContrasena}
        onChange={(e) => setNuevaContrasena(e.target.value)}
        sx={{ marginBottom: "20px" }}
      />
      <TextField
        fullWidth
        type="password"
        label="Confirmar Contraseña"
        value={confirmarContrasena}
        onChange={(e) => setConfirmarContrasena(e.target.value)}
        sx={{ marginBottom: "20px" }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleCambiarContrasena}
        sx={{ padding: "10px", fontWeight: "bold" }}
      >
        Cambiar Contraseña
      </Button>
    </Box>
  );
};

export default CambiarContrasena;
