package com.tucasa.backend.model.entity;

import com.tucasa.backend.model.enums.TipoInmueble;
import com.tucasa.backend.model.enums.TipoOperacion;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name = "ofertas")
public class Oferta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_inmueble", nullable = false)
    private Inmueble inmueble;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_operacion", nullable = false)
    private TipoOperacion tipo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "moneda", nullable = false, length = 5)
    private String moneda;      // Bs, $us, etc.

    @Column(name = "duracion_pago", nullable = true)
    private Integer duracion;   // Anticretico: 1 o 2 años (12 - 24 meses
                                // Alquiler: 15 o 30 dias (cada cuanto se paga)
                                // Venta: Nulo

    @Column(name = "tipo_pago", nullable = false)
    private String tipoPago;    // Anticretico: "unico", "Con retorno"
                                // Alquiler: "mensual", "quincenal", etc.
                                // Venta: "unico"

    @Column(name = "fecha_publicacion_inicio", nullable = false)
    private LocalDateTime fechaPublicacionInicio = LocalDateTime.now();

    @Column(name = "fecha_publicacion_fin", nullable = true)
    private LocalDateTime fechaPublicacionFin;

    @Column(name = "estado_publicacion", nullable = false)
    private String estadoPublicacion;
/*
    @Column(name = "estado_pago", nullable = false) // Reconsiderar
    private String estadoPago;
*/

    @Column(nullable = false)
    private boolean activo = true; // Para borrado logico
}
