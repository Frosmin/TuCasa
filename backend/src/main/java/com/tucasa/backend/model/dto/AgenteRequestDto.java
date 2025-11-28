package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.entity.Usuario;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgenteRequestDto {
    public interface Create{}
    public interface Update{}

    @NotNull(message = "El usuario es obligatorio", groups = Create.class)
    private Usuario usuario;

    private String descripcion;
    private String experiencia;
    private String matricula;   
    @NotNull(message = "El cv es obligatorio", groups = Create.class)
    private String cv;
}
