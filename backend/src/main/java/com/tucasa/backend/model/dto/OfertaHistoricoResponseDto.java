package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.enums.TipoOperacion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfertaHistoricoResponseDto {

    private Integer anio;

    private Integer mes;

    private BigDecimal promedioPrecio;

    private Long cantidadOfertas;

    public static OfertaHistoricoResponseDto mapToResult(Object[] row) {
        return new OfertaHistoricoResponseDto(
                ((Number) row[0]).intValue(),
                ((Number) row[1]).intValue(),
                new BigDecimal(row[2].toString()).setScale(2, RoundingMode.HALF_UP),
                ((Number) row[3]).longValue()
        );
    }

    public static List<OfertaHistoricoResponseDto> mapToList(List<Object[]> results) {
        return results.stream()
                .map(OfertaHistoricoResponseDto::mapToResult)
                .collect(Collectors.toList());
    }
}
