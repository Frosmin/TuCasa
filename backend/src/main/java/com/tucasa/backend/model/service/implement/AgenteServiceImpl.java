package com.tucasa.backend.model.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tucasa.backend.Constants.Constants;
import com.tucasa.backend.model.dto.AgenteRequestDto;
import com.tucasa.backend.model.dto.AgenteResponseDto;
import com.tucasa.backend.model.dto.SolicitudAgenteResponseDto;
import com.tucasa.backend.model.dto.UsuarioResponseDto;
import com.tucasa.backend.model.entity.Agente;
import com.tucasa.backend.model.entity.SolicitudAgente;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.TipoUsuario;
import com.tucasa.backend.model.repository.AgenteRepository;
import com.tucasa.backend.model.repository.SolicitudAgenteRepository;
import com.tucasa.backend.model.repository.UsuarioRepository;
import com.tucasa.backend.model.service.interfaces.AgenteService;
import com.tucasa.backend.payload.ApiResponse;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

@Service
public class AgenteServiceImpl implements AgenteService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AgenteRepository agenteRepository;

    @Autowired
    private SolicitudAgenteRepository solicitudAgenteRepository;

    @Autowired
    private ApiResponse apiResponse;

    @Override
    public ResponseEntity<?> findAll() {
        String successMessage = Constants.RECORDS_FOUND;
        String errorMessage = Constants.TABLE_NOT_FOUND;

        try {
            List<Agente> agentes = agenteRepository.findAll();
            if (!agentes.isEmpty()) {
                List<AgenteResponseDto> response = agentes.stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
                return apiResponse.responseSuccess(successMessage, response);
            } else {
                return apiResponse.responseDataError(errorMessage, null);
            }
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, null);
        }
    }

    @Override
    public ResponseEntity<?> findById(Long id) {
        String successMessage = Constants.RECORDS_FOUND;
        String errorMessage = "Agente no encontrado";

        try {
            Agente agente = agenteRepository.findById(id).orElseThrow(() -> new RuntimeException(errorMessage));
            return apiResponse.responseSuccess(successMessage, mapToDto(agente));
        } catch (Exception e) {
            return apiResponse.responseNotFoundError(errorMessage, e.getMessage());
        }
    }

    private AgenteResponseDto mapToDto(Agente agente) {
        if (agente == null)
            return null;

        UsuarioResponseDto usuarioDto = new UsuarioResponseDto();
        Usuario usuario = agente.getUsuario();

        usuarioDto.setId(usuario.getId());
        usuarioDto.setNombre(usuario.getNombre());
        usuarioDto.setApellido(usuario.getApellido());
        usuarioDto.setCorreo(usuario.getCorreo());
        usuarioDto.setDireccion(usuario.getDireccion());
        usuarioDto.setTelefono(usuario.getTelefono());
        usuarioDto.setRol(usuario.getRol());

        AgenteResponseDto dto = new AgenteResponseDto();

        dto.setId(agente.getId());
        dto.setUsuario(usuarioDto);
        dto.setDescripcion(agente.getDescripcion());
        dto.setMatricula(agente.getMatricula());
        dto.setExperiencia(agente.getExperiencia());
        dto.setCv(agente.getCv());

        return dto;
    }

    @Override
    @Transactional
    public ResponseEntity<?> create(AgenteRequestDto dto) {
        try {
            Usuario usuario = usuarioRepository.findById(dto.getUsuario().getId())
                    .orElseThrow(() -> new RuntimeException("usuario no encontrado"));

            Agente agente = new Agente();
            agente.setUsuario(usuario);
            agente.setDescripcion(dto.getDescripcion());
            agente.setExperiencia(dto.getExperiencia());
            agente.setId(usuario.getId());
            agente.setMatricula(dto.getMatricula());
            agente.setCv(dto.getCv());

            Agente agenteSave = agenteRepository.save(agente);

            return apiResponse.responseCreate(Constants.RECORD_CREATED, mapToDto(agenteSave));

        } catch (Exception e) {
            return apiResponse.responseDataError(Constants.RECORD_NOT_CREATED, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        String successMessage = Constants.RECORD_DELETED;
        String errorMessage = "Agente no encontrado " + id;

        try {
            Agente agente = agenteRepository.findById(id)
                    .orElse(null);

            if (agente == null) {
                return apiResponse.responseDataError(errorMessage,null);
            }

            agenteRepository.delete(agente);
            return apiResponse.responseSuccess(successMessage, null);
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }

    @Transactional
    public Agente convertirEnAgente(Long usuarioId, String descripcion, String experiencia, String matricula,
            String cv) {
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
        agente.setCv(cv);

        usuario.setRol(TipoUsuario.AGENTE_INMOBILIARIO);
        usuarioRepository.save(usuario);

        return agenteRepository.save(agente);
    }

    @Override
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
