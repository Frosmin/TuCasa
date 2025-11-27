package com.tucasa.backend.model.dto;

import java.math.BigDecimal;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.tucasa.backend.model.enums.TipoInmueble;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "tipo",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CasaRequestDto.class, name = "CASA"),
        @JsonSubTypes.Type(value = DepartamentoRequestDto.class, name = "DEPARTAMENTO"),
        @JsonSubTypes.Type(value = LoteRequestDto.class, name = "LOTE"),
        @JsonSubTypes.Type(value = TiendaRequestDto.class, name = "TIENDA")
        // LOS TIPOS QUE FALTEN Y SUS REQUEST DTO
})
public class InmuebleRequestDto {

    public interface Create {}
    public interface Update {}

    @NotBlank(message = "La dirección es obligatoria", groups = Create.class)
    private String direccion;

    @NotBlank(message = "La zona es obligatoria", groups = Create.class)
    private String zona;

    @NotNull(message = "La latitud es obligatoria", groups = Create.class)
    private BigDecimal latitud;

    @NotNull(message = "La longitud es obligatoria", groups = Create.class)
    private BigDecimal longitud;

    @NotNull(message = "La superficie es obligatoria", groups = Create.class)
    private BigDecimal superficie;

    @NotNull(message = "El propietario es obligatorio", groups = Create.class)
    private Long idPropietario;

    private String estadoPublicacion;

    private String descripcion;

    private Boolean activo;

    @NotNull(message = "El tipo de inmueble es obligatorio", groups = Create.class)
    private TipoInmueble tipo;

    private Set<Long> serviciosIds;

    private List<MultimediaRequestDto> multimedia;
}