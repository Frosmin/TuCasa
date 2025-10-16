package com.tucasa.backend.model.dto;

import java.math.BigDecimal;

import com.tucasa.backend.model.entity.Lote;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class LoteResponseDto extends InmuebleResponseDto {

    private BigDecimal tamanio;
    private boolean muroPerimetral;

    // Constructor que recibe un Lote y lo mapea al DTO
    public LoteResponseDto(Lote lote) {
        super(lote); // Inicializa los campos de InmuebleResponseDto
        this.tamanio = lote.getTamanio();
        this.muroPerimetral = lote.isMuroPerimetral();
    }
}
