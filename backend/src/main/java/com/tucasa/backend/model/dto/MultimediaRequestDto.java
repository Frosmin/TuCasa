package com.tucasa.backend.model.dto;
import com.tucasa.backend.model.enums.TipoMultimedia;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class MultimediaRequestDto {

    @NotNull(message = "La url es obligarotia")
    private String url;

    @NotNull(message = "El tipo es obligarotia")
    private TipoMultimedia tipo;

    private String descripcion;

    @NotNull(message = "Estado de activo es obligarotia")
    private Boolean activo = true;

    @NotNull(message = "Es portada es obligarotia")
    private Boolean esPortada = false;
}
