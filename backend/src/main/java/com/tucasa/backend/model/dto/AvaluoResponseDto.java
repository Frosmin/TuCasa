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
    private UsuarioResponseDto propietario;
    private UsuarioResponseDto agente;  // 👈 NUEVO
    private String celular;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private String direccion;
    private TipoAvaluo estado;
    private LocalDateTime fechaSolicitud;

    public AvaluoResponseDto(Avaluo avaluo) {
        this.id = avaluo.getId();
        this.tipoInmueble = avaluo.getTipo();

        // ---------- PROPIETARIO ------------
        this.propietario = new UsuarioResponseDto();
        this.propietario.setId(avaluo.getUsuario().getId());
        this.propietario.setNombre(avaluo.getUsuario().getNombre());
        this.propietario.setApellido(avaluo.getUsuario().getApellido());
        this.propietario.setTelefono(avaluo.getUsuario().getTelefono());
        this.propietario.setDireccion(avaluo.getUsuario().getDireccion());
        this.propietario.setCorreo(avaluo.getUsuario().getCorreo());
        this.propietario.setRol(avaluo.getUsuario().getRol());

        // ---------- AGENTE (si existe) ------
        if (avaluo.getAgente() != null) {
            this.agente = new UsuarioResponseDto();
            this.agente.setId(avaluo.getAgente().getId());
            this.agente.setNombre(avaluo.getAgente().getNombre());
            this.agente.setApellido(avaluo.getAgente().getApellido());
            this.agente.setTelefono(avaluo.getAgente().getTelefono());
            this.agente.setDireccion(avaluo.getAgente().getDireccion());
            this.agente.setCorreo(avaluo.getAgente().getCorreo());
            this.agente.setRol(avaluo.getAgente().getRol());
        } else {
            this.agente = null;
        }

        // ---------- RESTO DE CAMPOS ----------
        this.celular = avaluo.getCelular_Contacto();
        this.latitud = avaluo.getLatitud();
        this.longitud = avaluo.getLongitud();
        this.direccion = avaluo.getDireccion();
        this.estado = avaluo.getTipoAvaluo();
        this.fechaSolicitud = avaluo.getFechaCreacion();
    }
}
