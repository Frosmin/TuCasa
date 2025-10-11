package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.entity.Casa;
import com.tucasa.backend.model.enums.TipoInmueble;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class CasaResponseDto extends InmuebleResponseDto {

    private Integer numDormitorios;

    private Integer numBanos;

    private Integer numPisos;

    private Boolean garaje;

    private Boolean patio;

    private Boolean amoblado;

    private Boolean sotano;

    public CasaResponseDto(Casa casa) {
        super(casa);
        this.numDormitorios = casa.getNumDormitorios();
        this.numBanos = casa.getNumBanos();
        this.numPisos = casa.getNumPisos();
        this.garaje = casa.getGaraje();
        this.patio = casa.getPatio();
        this.amoblado = casa.getAmoblado();
        this.sotano = casa.getSotano();
    }

}
