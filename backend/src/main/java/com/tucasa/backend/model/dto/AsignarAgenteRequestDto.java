package com.tucasa.backend.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AsignarAgenteRequestDto {
    @NotNull(message="El id del agente es obligatorio")
    private Long idAgente;
    @NotNull(message="El id del avaluo es obligatorio")
    private Long idAvaluo;
}
