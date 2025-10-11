package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.enums.TipoInmueble;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
public class CasaResponseDto extends InmuebleResponseDto {

    private Integer numDormitorios;

    private Integer numBanos;

    private Integer numPisos;

    private Boolean garaje;

    private Boolean patio;

    private Boolean amoblado;

    private Boolean sotano;
}
