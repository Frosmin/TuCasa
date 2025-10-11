package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.enums.TipoOperacion;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfertaResponseDto {

    private Long id;

    private InmuebleResponseDto inmueble; // Devuelve la info completa del inmueble

    private String descripcion;

    private TipoOperacion tipo;

    private BigDecimal precio;

    private String moneda;

    private Integer duracion;

    private String tipoPago;

    private LocalDateTime fechaPublicacionInicio;

    private LocalDateTime fechaPublicacionFin;

    private String estadoPublicacion;

    private Boolean activo;
}
