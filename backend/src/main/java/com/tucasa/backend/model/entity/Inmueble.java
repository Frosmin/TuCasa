package com.tucasa.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tucasa.backend.model.enums.TipoInmueble;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.List;

@Data
@Entity
@Table(name = "inmuebles")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Inmueble {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false, precision = 18, scale = 15)
    private BigDecimal latitud;

    @Column(nullable = false, precision = 18, scale = 15)
    private BigDecimal longitud;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal superficie;  // Superficie en metros cuadrados

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_propietario", nullable = false)
    private Usuario propietario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_inmueble", nullable = false)
    private TipoInmueble tipo;

    /*
    @Column(name = "fecha_publicacion", nullable = false)
    private LocalDateTime fechaPublicacion = LocalDateTime.now();
     */
    /*
    @Column(name = "estado_publicacion", nullable = false)
    private String estadoPublicacion;
    */

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "inmueble_servicio",
            joinColumns = @JoinColumn(name = "inmueble_id"),
            inverseJoinColumns = @JoinColumn(name = "servicio_id")
    )
    private Set<Servicio> servicios;


    @OneToMany(mappedBy = "inmueble", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<Multimedia> multimedias;

    @Column(nullable = false)
    private boolean activo = true;
}
