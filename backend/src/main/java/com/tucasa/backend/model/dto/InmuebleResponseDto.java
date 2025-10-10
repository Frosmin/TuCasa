package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.enums.TipoInmueble;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class InmuebleResponseDto {

    private Long id;

    private String direccion;

    private BigDecimal superficie;

    private Long idPropietario;

    private LocalDateTime fechaPublicacion;

    private String estadoPublicacion;

    private String descripcion;

    private boolean activo;

    private TipoInmueble tipo;

    private Set<ServicioResponseDto> servicios;
}
