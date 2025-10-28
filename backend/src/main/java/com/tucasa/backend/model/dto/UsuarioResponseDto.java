package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.enums.TipoUsuario;

import lombok.Data;

@Data
public class UsuarioResponseDto {
    private Long id;
    private String nombre;
    private String apellido;
    private String telefono;
    private String correo;
    private TipoUsuario rol;
}
