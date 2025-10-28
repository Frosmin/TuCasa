package com.tucasa.backend.security.auth.controller;

import com.tucasa.backend.security.auth.dto.AuthenticationRequest;
import com.tucasa.backend.security.auth.dto.AuthenticationResponse;
import com.tucasa.backend.security.auth.dto.RegisterRequest;
import com.tucasa.backend.security.auth.jwt.JwtService;
import com.tucasa.backend.security.auth.service.AuthenticationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationService authService;
    private final JwtService jwtService;

    public AuthController(AuthenticationService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
