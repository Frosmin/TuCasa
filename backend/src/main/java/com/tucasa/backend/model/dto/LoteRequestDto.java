package com.tucasa.backend.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;   
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;



@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LoteRequestDto extends InmuebleRequestDto {
    

    @NotNull(message = "El tamaño es obligatorio", groups = Create.class)
    private BigDecimal tamanio;

    private Boolean muroPerimetral;
    
}
