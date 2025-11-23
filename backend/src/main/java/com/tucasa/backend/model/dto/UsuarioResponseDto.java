package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.TipoUsuario;

import lombok.Data;

@Data
public class UsuarioResponseDto {
    private Long id;
    private String nombre;
    private String apellido;
    private String telefono;
    private String direccion;
    private String correo;
    private TipoUsuario rol;

    public UsuarioResponseDto(Usuario usuario) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.apellido = usuario.getApellido();
        this.telefono = usuario.getTelefono();
        this.direccion = usuario.getDireccion();
        this.correo = usuario.getCorreo();
        this.rol = usuario.getRol();
    }

    public UsuarioResponseDto(){
        this.id = 0L;
        this.nombre = "";
        this.apellido = "";
        this.telefono = "";
        this.direccion = "";
        this.correo = "";
        this.rol = null;
    }
}
