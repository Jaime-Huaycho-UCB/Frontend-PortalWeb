import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecuperarContrasena = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate(); // Hook para redirigir

  const handleEnviar = async () => {
    if (!email) {
      setMensaje("Por favor, ingrese su correo electrónico.");
      return;
    }
  
    try {
      // Realiza la petición POST al backend
      const response = await axios.post("http://192.168.1.132:8000/recuperar/contrasena", {
        correo: email,
      });
  
      // Maneja la respuesta del backend
      if (response.data.salida) {
        setMensaje("Se ha enviado un correo de recuperación a su dirección.");
        console.log(response.data.codigo);

        // Redirige a la pantalla deseada con el parámetro
        // Redirige a la pantalla deseada con los parámetros
navigate("/validar", { state: { codigo: response.data.codigo, email } });

      } else {
        setMensaje("No se pudo enviar el correo. Inténtalo nuevamente.");
      }
    } catch (error) {
      // Manejo de errores
      console.error("Error al enviar el correo de recuperación:", error);
      setMensaje("Hubo un problema al procesar su solicitud. Intente de nuevo más tarde.");
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
        Recuperar Contraseña
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "#666", marginBottom: "20px" }}
      >
        Introduzca su correo electrónico para recuperar su contraseña.
      </Typography>
      <TextField
        fullWidth
        type="email"
        label="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginBottom: "20px" }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleEnviar}
        sx={{ padding: "10px", fontWeight: "bold" }}
      >
        Enviar
      </Button>
      {mensaje && (
        <Typography
          variant="body2"
          sx={{ color: mensaje.includes("error") ? "red" : "green", marginTop: "20px" }}
        >
          {mensaje}
        </Typography>
      )}
    </Box>
  );
};

export default RecuperarContrasena;
