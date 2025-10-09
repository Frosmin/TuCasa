package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.enums.TipoInmueble;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InmuebleRequestDto {

    public interface Create {}
    public interface Update {}

    @NotBlank(message = "La dirección es obligatoria", groups = Create.class)
    private String direccion;

    @NotNull(message = "La superficie es obligatoria", groups = Create.class)
    private BigDecimal superficie;

    @NotNull(message = "El propietario es obligatorio", groups = Create.class)
    private Long idPropietario;

    private String estadoPublicacion;

    private String descripcion;

    private Boolean activo;

    private TipoInmueble tipo;

    private Set<Long> serviciosIds;
}
