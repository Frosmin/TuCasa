package com.tucasa.backend.model.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum TipoAvaluo {
    PENDIENTE,      
    EN_PROCESO,     
    COMPLETADO,     
    CANCELADO       
}
