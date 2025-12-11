package com.tucasa.backend.model.entity;

import com.tucasa.backend.model.enums.TipoInmueble;
import com.tucasa.backend.model.enums.TipoAvaluo;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "avaluos")
public class Avaluo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_inmueble", nullable = false)
    private TipoInmueble tipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_agente", nullable = true)
    private Usuario agente;

    @Column(name = "celular_contacto", nullable = false)
    private String celular_Contacto;

    @Column(nullable = false, precision = 18, scale = 15)
    private BigDecimal latitud;

    @Column(nullable = false, precision = 18, scale = 15)
    private BigDecimal longitud;

    @Column(nullable = false)
    private String direccion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private TipoAvaluo tipoAvaluo;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    // Inicializa la fecha antes de persistir
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}
    