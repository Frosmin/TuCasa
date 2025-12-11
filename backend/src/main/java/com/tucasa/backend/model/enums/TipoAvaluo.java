package com.tucasa.backend.model.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum TipoAvaluo {
    CANCELADO,
    POR_ASIGNAR,      
    EN_PROGRESO,     
    COMPLETADO     
}
