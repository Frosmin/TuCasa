package com.tucasa.backend.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DepartamentoRequestDto extends InmuebleRequestDto {
    @NotNull(message = "Cantidad de dormitorios es obligatorio", groups = Create.class)
    @Min(value = 1, message = "Debe tener al menos un dormitorio", groups = Create.class)
    private Integer numDormitorios;

    @NotNull(message = "Cantidad de baños es obligatorio", groups = Create.class)
    @Min(value = 1, message = "Debe tener al menos un baño", groups = Create.class)
    private Integer numBanos;

    @NotNull(message = "El número de piso es obligatorio", groups = Create.class)
    @Min(value = 1, message = "Debe ser un piso válido (1 o superior)", groups = Create.class)
    private Integer piso;

    @NotNull(message = "La superficie interna es obligatorio", groups = Create.class)
    @Min(value = 1, message = "Debe tener una superficie válida", groups = Create.class)
    private BigDecimal superficieInterna;

    @NotNull(message = "El monto de expensas es obligatorio", groups = Create.class)
    @Min(value = 0, message = "El monto de expensas no puede ser negativo", groups = Create.class)
    private BigDecimal montoExpensas;

    private Boolean mascotasPermitidas = false;

    private Boolean parqueo = false;

    private Boolean amoblado = false;

    private Boolean ascensor = false;

    private Boolean balcon = false;

    private Boolean baulera = false;
}
