package com.tucasa.backend.model.service.implement;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tucasa.backend.model.dto.UsuarioRequestDto;
import com.tucasa.backend.model.dto.UsuarioResponseDto;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.TipoUsuario;
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

    private UsuarioResponseDto mapToDto(Usuario usuario) {
        UsuarioResponseDto dto = new UsuarioResponseDto(usuario);
        
        return dto;
    }
}
