package com.tucasa.backend.model.entity;

import java.time.LocalDateTime;
import com.tucasa.backend.model.enums.EstadoSolicitud;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "solicitud_agente")
@Data
public class SolicitudAgente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    private String descripcion;
    private String experiencia;
    private String matricula;

    @Column(nullable = false)
    private String cvPath; 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;

    private LocalDateTime fechaSolicitud = LocalDateTime.now();
}
