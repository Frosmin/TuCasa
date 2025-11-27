package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.entity.Avaluo;
import com.tucasa.backend.model.enums.TipoAvaluo;
import com.tucasa.backend.model.enums.TipoInmueble;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
public class AvaluoResponseDto {

    private Long id;
    private TipoInmueble tipoInmueble;
    private Long propietario;
    private String celular;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private String direccion;
    private TipoAvaluo estado;
    private LocalDateTime fechaSolicitud;

    public AvaluoResponseDto(Avaluo avaluo) {
        this.id = avaluo.getId();
        this.propietario = avaluo.getUsuario().getId();
        this.tipoInmueble = avaluo.getTipo();
        this.celular = avaluo.getCelular_Contacto();
        this.latitud = avaluo.getLatitud();
        this.longitud = avaluo.getLongitud();
        this.direccion = avaluo.getDireccion();
        this.estado = avaluo.getTipoAvaluo();
        this.fechaSolicitud = avaluo.getFechaCreacion();
    }
}