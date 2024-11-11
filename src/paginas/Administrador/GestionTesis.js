import React from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Divider } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const GestionTesis = () => {
  // Datos de muestra, puedes reemplazar esto con tus datos reales
  const tesisData = [
    {
      titulo: 'Administración de recursos humanos',
      contenido: 'Idalberto Chiavenato',
      tipo: 'Texto',
      fechaPublicacion: '2011',
      resumen: 'El capital humano de las organizaciones.',
    },
    {
      titulo: 'Economía industrial',
      contenido: 'Juan Fernández de Castro',
      tipo: 'Texto',
      fechaPublicacion: '2003',
      resumen: 'Un enfoque estratégico en la economía industrial.',
    },
    {
      titulo: 'Marketing de servicios',
      contenido: 'Christopher Lovelock',
      tipo: 'Texto',
      fechaPublicacion: '2006',
      resumen: 'Estrategias de marketing para servicios.',
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Tesis
      </Typography>
      <Grid container spacing={3}>
        {tesisData.map((tesis, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ display: 'flex', flexDirection: 'column', padding: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {index + 1}. {tesis.titulo}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Autor: {tesis.contenido}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tipo de material: {tesis.tipo}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Fecha de publicación: {tesis.fechaPublicacion}
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Typography variant="body2" paragraph>
                  Resumen: {tesis.resumen}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  <Button variant="outlined" startIcon={<LibraryBooksIcon />}>
                    Ver Contenido
                  </Button>
                  <Button variant="outlined" startIcon={<StarBorderIcon />}>
                    Agregar a Favoritos
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GestionTesis;
