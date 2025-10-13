package com.tucasa.backend.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

import lombok.Data;

@Data
public class LoteResponseDto {
    private Long id;

    private String direccion;

    private BigDecimal superficie;

    private Long idPropietario;

    private LocalDateTime fechaPublicacion;

    private String descripcion;

    private String estadoPublicacion;

    private boolean activo;

    private BigDecimal tamanio;

    private boolean muroPerimetral;

    private Set<ServicioResponseDto> servicios;
}
