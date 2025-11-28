package com.tucasa.backend.model.service.implement;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tucasa.backend.model.dto.UsuarioRequestDto;
import com.tucasa.backend.model.dto.UsuarioResponseDto;
import com.tucasa.backend.model.entity.Avaluo;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.TipoAvaluo;
import com.tucasa.backend.model.enums.TipoUsuario;
import com.tucasa.backend.model.repository.AvaluoRepository;
import com.tucasa.backend.model.repository.SolicitudAgenteRepository;
import com.tucasa.backend.model.repository.UsuarioRepository;
import com.tucasa.backend.model.service.interfaces.UsuarioService;
import com.tucasa.backend.payload.ApiResponse;

import jakarta.transaction.Transactional;

@Service
public class UsuarioServiceImpl implements UsuarioService{
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ApiResponse apiResponse;

    @Autowired
    private SolicitudAgenteRepository solicitudAgenteRepository;

    @Autowired
    private AvaluoRepository avaluoRepository;

    @Override
    public ResponseEntity<?> getAll(){
        String successMessage = "Usuarios encontrados";
        String errorMessage = "No se encontraron usuarios";
        try {
            List<Usuario> usuarios = usuarioRepository.findAll();
            if (usuarios.isEmpty()) {
                return apiResponse.responseDataError(errorMessage, null);
            }
            List<UsuarioResponseDto> dtos = usuarios.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
            return apiResponse.responseSuccess(successMessage, dtos);
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> registrarUsuario(UsuarioRequestDto dto) {
        String successMessage = "Usuario registrado correctamente";
        String errorMessage = "Error al registrar usuario";
        try {
            if (usuarioRepository.findByCorreo(dto.getCorreo()).isPresent()) {
                return apiResponse.responseDataError("El correo ya está registrado", null);
            }
            Usuario usuario = new Usuario();
            usuario.setNombre(dto.getNombre());
            usuario.setApellido(dto.getApellido());
            usuario.setTelefono(dto.getTelefono());
            usuario.setDireccion(dto.getDireccion());
            usuario.setCorreo(dto.getCorreo());
            usuario.setContrasenia(dto.getContrasenia());
            TipoUsuario dtoRol = dto.getRol();
            if (dtoRol != null) {
                usuario.setRol(dtoRol);
            } else {
                usuario.setRol(TipoUsuario.CLIENTE);
            }
            Usuario saved = usuarioRepository.save(usuario);
            return apiResponse.responseCreate(successMessage, mapToDto(saved));
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> volverACliente(Long id){
        String successMessage = "Cambio de rol a Agente exitoso";
        String errorMessage = "No se pudo hacer el cambio de rol";
        String badRequestMessage = "No se puede realizar esta operacion con este usuario.";
        try {
            Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(errorMessage));
            if (usuario.getRol() == TipoUsuario.AGENTE_INMOBILIARIO) {
                usuario.setRol(TipoUsuario.CLIENTE);
                // Eliminacion de Solicitudes de agente
                solicitudAgenteRepository.deleteByUsuarioId(id);
                // Cambio de estado a PENDIENTE para avaluos que fueron asignados al agente.
                List<Avaluo> avaluosAsignados = avaluoRepository.findByAgenteId(id);
                if (!avaluosAsignados.isEmpty()) {
                    for (Avaluo avaluo : avaluosAsignados) {
                        avaluo.setTipoAvaluo(TipoAvaluo.PENDIENTE);
                        avaluo.setAgente(null);
                        avaluoRepository.save(avaluo);
                    }
                }
                Usuario userUpdated = usuarioRepository.save(usuario);
                return apiResponse.responseSuccess(successMessage, mapToDto(userUpdated));
            } else {
                return apiResponse.responseBadRequest(badRequestMessage);
            }
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e);
        }
    }

    private UsuarioResponseDto mapToDto(Usuario usuario) {
        UsuarioResponseDto dto = new UsuarioResponseDto(usuario);
        
        return dto;
    }
}
