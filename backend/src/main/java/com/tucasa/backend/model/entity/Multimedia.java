package com.tucasa.backend.model.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
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

    // @Column(nullable = false, columnDefinition = "TEXT")
    // private String descripcion;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean es_portada = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inmueble_id", nullable = false)
    @JsonBackReference
    private Inmueble inmueble;   
}
