import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TextField, Button, Box, Typography } from "@mui/material";

const Validar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { codigo,email } = location.state || {};
  const [codigoIngresado, setCodigoIngresado] = useState("");
console.log(email);
  const handleValidarCodigo = () => {
    if (codigoIngresado === codigo) {
      Swal.fire({
        title: "¡Éxito!",
        text: "El código es correcto.",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        navigate("/cambiar", { state: { email } });
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "El código ingresado no es válido.",
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
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", marginBottom: "20px" }}
      >
        Validar Código
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "#666", marginBottom: "20px" }}
      >
        Introduzca el código recibido para continuar.
      </Typography>
      <TextField
        fullWidth
        type="text"
        label="Código"
        value={codigoIngresado}
        onChange={(e) => setCodigoIngresado(e.target.value)}
        sx={{ marginBottom: "20px" }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleValidarCodigo}
        sx={{ padding: "10px", fontWeight: "bold" }}
      >
        Validar
      </Button>
    </Box>
  );
};

export default Validar;
