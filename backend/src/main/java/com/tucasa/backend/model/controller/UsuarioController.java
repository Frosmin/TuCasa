package com.tucasa.backend.model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tucasa.backend.model.dto.UsuarioRequestDto;
import com.tucasa.backend.model.service.interfaces.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("")
    public ResponseEntity<?> obtenerUsuarios(){
        return usuarioService.getAll();
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody UsuarioRequestDto usuarioRequestDto) {
        return usuarioService.registrarUsuario(usuarioRequestDto);
    }
}
