package com.tucasa.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificacionDTO {
    private Long avaluoId;
    private Long clienteId;
    private String mensaje;
    private String nuevoEstado;
}
