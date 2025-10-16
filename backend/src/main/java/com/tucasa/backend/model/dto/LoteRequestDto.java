package com.tucasa.backend.model.dto;


import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class LoteRequestDto extends InmuebleRequestDto {
    // @NotNull(message = "El tamaño es obligatorio", groups = InmuebleRequestDto.Create.class)
    private BigDecimal tamanio;


    private Boolean muroPerimetral;

    public interface Create {}
    public interface Update {}

}