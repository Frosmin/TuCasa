package com.tucasa.backend.model.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tucasa.backend.security.auth.dto.RegisterRequest;
import com.tucasa.backend.security.auth.service.AuthenticationService;
import com.tucasa.backend.payload.ApiResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final AuthenticationService authService;
    private final ApiResponse apiResponse;

    public UsuarioController(AuthenticationService authService, ApiResponse apiResponse) {
        this.authService = authService;
        this.apiResponse = apiResponse;
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody RegisterRequest request) {
        try {
            Map<String, Object> responseData = authService.register(request);
            Object usuario = responseData.get("usuario");
            String token = (String) responseData.get("token");
            return apiResponse.responseCreateWithToken("Usuario registrado correctamente", usuario, token);
        } catch (Exception e) {
            return apiResponse.responseDataError("Error al registrar usuario", e.getMessage());
        }
    }
}
