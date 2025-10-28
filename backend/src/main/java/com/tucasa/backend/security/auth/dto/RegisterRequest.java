package com.tucasa.backend.security.auth.dto;

public record RegisterRequest(
    String name,
    String email,
    String password,
    String direccion,
    String telefono
) {}
