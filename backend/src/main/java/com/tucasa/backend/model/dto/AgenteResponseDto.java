package com.tucasa.backend.model.dto;
import lombok.*; 

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgenteResponseDto {
    private Long id;

    private UsuarioResponseDto usuario;

    private String descripcion;
    private String experiencia;
    private String matricula;
    private String cv;
}
