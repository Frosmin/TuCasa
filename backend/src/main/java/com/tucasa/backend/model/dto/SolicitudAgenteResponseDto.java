package com.tucasa.backend.model.dto;

import java.time.LocalDateTime;

import com.tucasa.backend.model.enums.EstadoSolicitud;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudAgenteResponseDto {
    private Long id;
    private UsuarioResponseDto usuario;
    private String descripcion;
    private String experiencia;
    private String matricula;
    private String cvPath;
    private EstadoSolicitud estado;
    private LocalDateTime fechaSolicitud;

}
