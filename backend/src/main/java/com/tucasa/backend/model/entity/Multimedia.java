package com.tucasa.backend.model.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.tucasa.backend.model.enums.TipoMultimedia;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name= "Multimedias")
public class Multimedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;


    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoMultimedia multimedia;


    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion = "Descripcion para el futuro";

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean es_portada = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inmueble_id", nullable = false)
    @JsonBackReference
    private Inmueble inmueble;   
}
