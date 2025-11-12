package com.tucasa.backend.security.auth.dto;

public record AuthenticationRequest(
    String email,
    String password
) {}
