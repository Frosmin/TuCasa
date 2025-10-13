package com.tucasa.backend.model.service.interfaces;

import org.springframework.http.ResponseEntity;

public interface DepartamentoService {
    ResponseEntity<?> findAll();
}