package com.tucasa.backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "casas")
@PrimaryKeyJoinColumn(name = "id") // relacion con inmueble via extend, comparten id
public class Casa extends Inmueble {

    @Column(name = "num_dormitorios", nullable = false)
    private Integer numDormitorios;

    @Column(name = "num_banos", nullable = false)
    private Integer numBanos;

    @Column(name = "num_pisos", nullable = false)
    private Integer numPisos;

    @Column(nullable = false)
    private Boolean garaje = false;

    @Column(nullable = false)
    private Boolean patio = false;

    @Column(nullable = false)
    private Boolean amoblado = false;

    @Column(nullable = false)
    private Boolean sotano = false;
}
