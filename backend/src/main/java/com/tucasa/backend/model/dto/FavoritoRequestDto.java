package com.tucasa.backend.model.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FavoritoRequestDto {
    // @NotNull(message = "El ID del usuario es obligatorio")
    // private Long usuarioId;

    @NotNull(message = "El ID de la oferta es obligatorio")
    private Long ofertaId;
}
