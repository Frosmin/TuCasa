package com.tucasa.backend.model.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;


@EqualsAndHashCode(callSuper = false)
@Data
@NoArgsConstructor
@Entity
@Table(name = "lotes")
@PrimaryKeyJoinColumn(name = "id")
public class Lote extends Inmueble {

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal tamanio;

    @Column(name = "muro_perimetral", nullable = false)
    private boolean muroPerimetral;
    
}
