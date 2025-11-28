package com.tucasa.backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "agente")
@Data
public class Agente {

    @Id
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    private String descripcion;
    private String experiencia;
    private String matricula;  
    private String cv;
}
