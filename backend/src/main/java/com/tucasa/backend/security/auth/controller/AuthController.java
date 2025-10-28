package com.tucasa.backend.security.auth.controller;

import com.tucasa.backend.payload.ApiResponse;
import com.tucasa.backend.security.auth.dto.AuthenticationRequest;
import com.tucasa.backend.security.auth.dto.AuthenticationResponse;
import com.tucasa.backend.security.auth.dto.RegisterRequest;
import com.tucasa.backend.security.auth.jwt.JwtService;
import com.tucasa.backend.security.auth.service.AuthenticationService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationService authService;
    private final JwtService jwtService;
    private final ApiResponse apiResponse;

    public AuthController(AuthenticationService authService, JwtService jwtService, ApiResponse apiResponse) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.apiResponse = apiResponse;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request) {
        Map<String, Object> responseData = authService.register(request);
        Object user = responseData.get("usuario");
        String token = (String) responseData.get("token");
        return apiResponse.responseCreateWithToken(
            "Registro Exitoso", 
            user, 
            token
        );
    }

    @PostMapping("/login")
    public ResponseEntity<Object> authenticate(@RequestBody AuthenticationRequest request) {
        Map<String, Object> responseData = authService.authenticate(request);
        Object user = responseData.get("usuario");
        String token = (String) responseData.get("token");
        return apiResponse.responseCreateWithToken(
            "Autenticación Exitosa", 
            user, 
            token
        );
    }
}
