package com.tucasa.backend.model.entity;

import com.tucasa.backend.model.enums.TipoUsuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "usuario")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String telefono;

    @Column(unique= true, nullable = false)
    private String correo;

    private String contrasenia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoUsuario rol;
}
