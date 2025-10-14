package com.tucasa.backend.model.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "departamentos")
@PrimaryKeyJoinColumn(name = "id") // relacion con inmueble via extend, comparten id
public class Departamento extends Inmueble{

    @Column(name = "num_dormitorios", nullable = false)
    private Integer numDormitorios;

    @Column(name = "num_banos", nullable = false)
    private Integer numBanos;

    @Column(nullable = false)
    private Integer piso;

    @Column(name = "superficie_interna", nullable = false, precision = 10, scale = 2)
    private BigDecimal superficieInterna;

    @Column(name = "monto_expensas", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoExpensas;

    @Column(name = "mascotas_permitidas", nullable = false)
    private Boolean mascotasPermitidas = false;

    @Column(nullable = false)
    private Boolean parqueo = false;

    @Column(nullable = false)
    private Boolean amoblado = false;

    @Column(nullable = false)
    private Boolean ascensor = false;

    @Column(nullable = false)
    private Boolean balcon = false;
    
}
