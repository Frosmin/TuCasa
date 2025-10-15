package com.tucasa.backend.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TiendaRequestDto extends InmuebleRequestDto {

    @NotNull(message = "Cantidad de ambientes es obligatoria", groups = Create.class)
    @Min(value = 1, message = "Debe tener al menos un ambiente", groups = Create.class)
    private Integer numAmbientes;

    private Boolean banoPrivado = false;

    private Boolean deposito = false;

}
