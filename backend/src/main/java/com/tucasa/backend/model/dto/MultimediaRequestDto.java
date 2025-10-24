package com.tucasa.backend.model.dto;
import com.tucasa.backend.model.enums.TipoMultimedia;

import lombok.Data;
@Data
public class MultimediaRequestDto {
    private String url;
    private TipoMultimedia tipo;
    private String descripcion;
    private Boolean activo = true;
    private Boolean esPortada = false;
}
