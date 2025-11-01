package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.enums.TipoUsuario;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequestDto {
    private String nombre;
    private String apellido;
    private String telefono;
    private String direccion;
    private String correo;
    private String contrasenia;
    private TipoUsuario rol;
}