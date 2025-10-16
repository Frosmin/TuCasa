package com.tucasa.backend.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class LoteRequestDto extends InmuebleRequestDto {
    @NotNull(message = "El tamaño es obligatorio", groups = InmuebleRequestDto.Create.class)
    private BigDecimal tamanio;


    private Boolean muroPerimetral;

    public interface Create {}
    public interface Update {}
}
