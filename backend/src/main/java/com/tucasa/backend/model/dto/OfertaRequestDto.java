package com.tucasa.backend.model.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.tucasa.backend.model.enums.TipoOperacion;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfertaRequestDto {

    public interface Create {}
    public interface Update {}

    @NotNull(message = "El inmueble es obligatorio", groups = Create.class)
    private InmuebleRequestDto inmueble;

    private String descripcion;

    @NotNull(message = "El tipo de operación es obligatorio", groups = Create.class)
    private TipoOperacion tipoOperacion;

    @NotNull(message = "El precio es obligatorio", groups = Create.class)
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0", groups = Create.class)
    private BigDecimal precio;

    @NotBlank(message = "La moneda es obligatoria", groups = Create.class)
    private String moneda;      // Bs, $US, Etc.

    private Integer duracion;   // Segun el tipo: Nulo para venta, 15/30 dias alguiler, etc.

    @NotBlank(message = "El tipo de pago es obligatorio", groups = Create.class)
    private String tipoPago;    // Venta: unico | Alquiler: mensual, quincenal, etc. | Anticretico: Con retorno, etc.

    private LocalDateTime fechaPublicacionInicio;

    private LocalDateTime fechaPublicacionFin;

    private String estadoPublicacion;   // Pendiente, En Revision, Publicado, Cancelado

    private Boolean activo;             // True o False, borrado logico
}
