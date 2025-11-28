package com.tucasa.backend.model.service.implement;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tucasa.backend.model.dto.SolicitudAgenteResponseDto;
import com.tucasa.backend.model.dto.UsuarioResponseDto;
import com.tucasa.backend.model.entity.Agente;
import com.tucasa.backend.model.entity.SolicitudAgente;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.TipoUsuario;
import com.tucasa.backend.model.repository.AgenteRepository;
import com.tucasa.backend.model.repository.SolicitudAgenteRepository;
import com.tucasa.backend.model.repository.UsuarioRepository;
import com.tucasa.backend.payload.ApiResponse;

import jakarta.transaction.Transactional;

@Service
public class AgenteService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AgenteRepository agenteRepository;

    @Autowired
    private ApiResponse apiResponse;

    @Autowired
    private SolicitudAgenteRepository solicitudAgenteRepository;

    @Transactional
    public Agente convertirEnAgente(Long usuarioId, String descripcion, String experiencia, String matricula) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getRol() == TipoUsuario.AGENTE_INMOBILIARIO) {
            throw new RuntimeException("El usuario ya es agente inmobiliario");
        }

        Agente agente = new Agente();
        agente.setUsuario(usuario);
        agente.setDescripcion(descripcion);
        agente.setExperiencia(experiencia);
        agente.setMatricula(matricula);
        agente.setVerificado(false);

        usuario.setRol(TipoUsuario.AGENTE_INMOBILIARIO);
        usuarioRepository.save(usuario);

        return agenteRepository.save(agente);
    }

    public ResponseEntity<?> infoAgente(Long id){
        String successMessage = "Datos del agente enviados";
        String errorMessage = "No se pudo obtener los datos del agente";
        String notAgentMessage = "El usuario no tiene el rol de agente inmobiliario.";
        try {
            Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró al agente"));
            if (usuario.getRol() == TipoUsuario.AGENTE_INMOBILIARIO) {
                List<SolicitudAgente> solicitudesAgente = solicitudAgenteRepository.findByUsuarioId(id);
                List<SolicitudAgenteResponseDto> solicitudesDto = solicitudesAgente.stream()
                    .map(this::mapToSolicitudAgenteDto)
                    .collect(Collectors.toList());
                return apiResponse.responseSuccess(successMessage, solicitudesDto);   
            } else {
                return apiResponse.responseBadRequest(notAgentMessage);
            }
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, null);
        }
    }

    private SolicitudAgenteResponseDto mapToSolicitudAgenteDto(SolicitudAgente solicitud) {
        UsuarioResponseDto usuarioDto = mapToUsuarioDto(solicitud.getUsuario()); 
        return SolicitudAgenteResponseDto.builder()
            .id(solicitud.getId())
            .usuario(usuarioDto)
            .descripcion(solicitud.getDescripcion())
            .experiencia(solicitud.getExperiencia())
            .matricula(solicitud.getMatricula())
            .cvPath(solicitud.getCvPath())
            .estado(solicitud.getEstado())
            .fechaSolicitud(solicitud.getFechaSolicitud())
            .build();
    }

    private UsuarioResponseDto mapToUsuarioDto(Usuario usuario) {
        UsuarioResponseDto dto = new UsuarioResponseDto(usuario);
        return dto;
    }
}
