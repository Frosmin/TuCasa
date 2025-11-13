package com.tucasa.backend.model.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
public class OfertaResponseFavoritoDto extends OfertaResponseDto {

    private Long totalFavoritos;

    public OfertaResponseFavoritoDto(OfertaResponseDto dto, Long totalFavoritos) {
        super(
            dto.getId(),
            dto.getInmueble(),
            dto.getDescripcion(),
            dto.getTipo(),
            dto.getPrecio(),
            dto.getMoneda(),
            dto.getDuracion(),
            dto.getTipoPago(),
            dto.getFechaPublicacionInicio(),
            dto.getFechaPublicacionFin(),
            dto.getEstadoPublicacion(),
            dto.getActivo()
            
            
        );
        this.totalFavoritos = totalFavoritos;
    }
}