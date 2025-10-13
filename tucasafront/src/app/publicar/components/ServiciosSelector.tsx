import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Checkbox, Box } from '@mui/material';

interface ServiciosSelectorProps {
  servicios: { id: number; nombre: string }[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export default function ServiciosSelector({ servicios, selectedIds, onChange }: ServiciosSelectorProps) {
  const handleToggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
        Servicios
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {servicios.map((servicio) => (
          <Card
            key={servicio.id}
            sx={{
              width: 160,
              border: selectedIds.includes(servicio.id) ? '2px solid #1976d2' : '1px solid #e0e0e0',
              boxShadow: selectedIds.includes(servicio.id) ? 4 : 1,
              transition: 'box-shadow 0.2s, border 0.2s',
            }}
          >
            <CardActionArea onClick={() => handleToggle(servicio.id)}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={selectedIds.includes(servicio.id)}
                  tabIndex={-1}
                  disableRipple
                  color="primary"
                  sx={{ p: 0 }}
                  slotProps={{input: { 'aria-label': servicio.nombre }}}
                />
                <Typography variant="body1">{servicio.nombre}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}