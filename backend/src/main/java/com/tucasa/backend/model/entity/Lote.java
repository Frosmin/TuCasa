package com.tucasa.backend.model.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Entity
@DiscriminatorValue("LOTE")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Lote extends Inmueble {

    @Column(nullable = true, precision = 10, scale = 2)
    private BigDecimal tamanio;

    @Column(name = "muro_perimetral", nullable = false)
    private boolean muroPerimetral;
}
