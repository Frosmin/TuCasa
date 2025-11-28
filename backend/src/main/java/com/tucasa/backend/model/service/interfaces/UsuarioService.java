package com.tucasa.backend.model.service.interfaces;

import org.springframework.http.ResponseEntity;

import com.tucasa.backend.model.dto.UsuarioRequestDto;

public interface UsuarioService {
    ResponseEntity<?> registrarUsuario(UsuarioRequestDto usuarioRequestDto);
    ResponseEntity<?> getAll();
    ResponseEntity<?> volverACliente(Long id);
}
