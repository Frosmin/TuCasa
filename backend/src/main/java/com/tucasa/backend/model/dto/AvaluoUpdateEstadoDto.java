package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.enums.TipoAvaluo;
import lombok.Data;

@Data
public class AvaluoUpdateEstadoDto {
    private TipoAvaluo nuevoEstado;
}