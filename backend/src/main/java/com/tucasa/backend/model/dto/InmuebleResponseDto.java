package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.entity.Inmueble;
import com.tucasa.backend.model.entity.Multimedia;
import com.tucasa.backend.model.enums.TipoInmueble;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class InmuebleResponseDto {

    private Long id;

    private String zona;

    private String direccion;

    private BigDecimal latitud;

    private BigDecimal longitud;

    private BigDecimal superficie;

    private Long idPropietario;

    private String descripcion;

    private boolean activo;

    private TipoInmueble tipo;

    private Set<ServicioResponseDto> servicios;

    private String url_imagen;

    private List<MultimediaResponseDto> multimedias;

    public InmuebleResponseDto(Inmueble inmueble) {
        this.id = inmueble.getId();
        this.direccion = inmueble.getDireccion();
        this.zona = inmueble.getZona();
        this.latitud = inmueble.getLatitud();
        this.longitud = inmueble.getLongitud();
        this.superficie = inmueble.getSuperficie();
        this.idPropietario = inmueble.getIdPropietario();
        this.descripcion = inmueble.getDescripcion();
        this.activo = inmueble.isActivo();
        this.tipo = inmueble.getTipo();

        if (inmueble.getMultimedias() != null && !inmueble.getMultimedias().isEmpty()) {
            this.multimedias = inmueble.getMultimedias().stream()
                    .map(m -> new MultimediaResponseDto(m.getUrl(), m.getEs_portada()))
                    .collect(Collectors.toList());
        }

        // if (inmueble.getMultimedias() != null && !inmueble.getMultimedias().isEmpty()) {
        // this.url_imagen = inmueble.getMultimedias().stream()
        //         .filter(Multimedia::getEs_portada)
        //         .findFirst()
        //         .map(Multimedia::getUrl)
        //         .orElse(inmueble.getMultimedias().get(0).getUrl()); 
    

        if (inmueble.getServicios() != null && !inmueble.getServicios().isEmpty()) {
            this.servicios = inmueble.getServicios().stream()
                    .map(s -> new ServicioResponseDto(s.getId(), s.getNombre()))
                    .collect(Collectors.toSet());
        }
    }
}
