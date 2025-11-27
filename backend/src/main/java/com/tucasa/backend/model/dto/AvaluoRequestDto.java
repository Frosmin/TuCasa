package com.tucasa.backend.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import com.tucasa.backend.model.enums.TipoInmueble;


@Data
public class AvaluoRequestDto {
    @NotNull(message = "El tipo de inmueble es obligatorio")
    private TipoInmueble tipoInmueble;

    @NotNull(message = "El celular de contacto es obligatorio")
    private String celularContacto;

    @NotNull(message = "La latitud es obligatoria")
    private BigDecimal latitud;

    @NotNull(message = "La longitud es obligatoria")
    private BigDecimal longitud;
}
