package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.enums.TipoInmueble;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CasaRequestDto extends InmuebleRequestDto {

    @NotNull(message = "Cantidad de dormitorios es obligatoria", groups = Create.class)
    @Min(value = 1, message = "Debe tener al menos un dormitorio", groups = Create.class)
    private Integer numDormitorios;

    @NotNull(message = "Cantidad de baños es obligatorio", groups = Create.class)
    @Min(value = 1, message = "Debe tener al menos un baño", groups = Create.class)
    private Integer numBanos;

    @NotNull(message = "El número de pisos es obligatorio", groups = Create.class)
    @Min(value = 1, message = "Debe tener al menos un piso (planta baja)", groups = Create.class)
    private Integer numPisos;

    private Boolean garaje = false;

    private Boolean patio = false;

    private Boolean amoblado = false;

    private Boolean sotano = false;
}
