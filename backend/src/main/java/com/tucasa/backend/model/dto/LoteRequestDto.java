package com.tucasa.backend.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;   
import lombok.Builder;
import java.math.BigDecimal;
import java.util.Set;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoteRequestDto {
    public interface Create {}
    public interface Update {}

    @NotBlank(message = "La dirección es obligatoria", groups = Create.class)
    private String direccion;

    @NotNull(message = "La latitud es obligatoria", groups = Create.class)
    private BigDecimal latitud;

    @NotNull(message = "La longitud es obligatoria", groups = Create.class)
    private BigDecimal longitud;

    @NotNull(message = "La superficie es obligatoria", groups = Create.class)   
    private BigDecimal superficie;

    @NotNull(message = "El propietario es obligatorio", groups = Create.class)  
    private Long idPropietario;

    
    private String descripcion;

    @NotNull(message = "El estado activo es obligatorio", groups = Create.class)
    private Boolean activo;

    @NotNull(message = "El tamaño es obligatorio", groups = Create.class)
    private BigDecimal tamanio;

    private Boolean muroPerimetral;
    
    private Set<Long> serviciosIds;


}
