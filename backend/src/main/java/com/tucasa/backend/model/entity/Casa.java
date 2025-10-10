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
    private int numDormitorios;

    @Column(name = "num_banos", nullable = false)
    private int numBanos;

    @Column(name = "num_pisos", nullable = false)
    private int numPisos;

    @Column(nullable = false)
    private boolean garaje = false;

    @Column(nullable = false)
    private boolean patio = false;

    @Column(nullable = false)
    private boolean amoblado = false;

    @Column(nullable = false)
    private boolean sotano = false;
}
