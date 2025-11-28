package com.tucasa.backend.model.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum TipoUsuario {
    CLIENTE,
    AGENTE_INMOBILIARIO,
    ADMIN
}
