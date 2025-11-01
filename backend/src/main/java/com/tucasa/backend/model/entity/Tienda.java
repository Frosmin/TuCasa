package com.tucasa.backend.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "tiendas")
@PrimaryKeyJoinColumn(name = "id") // relacion con inmueble via extend, comparten id
public class Tienda extends Inmueble {

    @Column(name = "num_ambientes", nullable = false)
    private Integer numAmbientes;

    @Column(name = "bano_privado", nullable = false)
    private Boolean banoPrivado = false;

    @Column(nullable = false)
    private Boolean deposito = false;

}
