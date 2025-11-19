package com.tucasa.backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "agente")
@Data
public class Agente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    private String descripcion;
    private String experiencia;
    private String matricula;  
    private boolean verificado = false; 
}
