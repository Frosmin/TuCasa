package com.tucasa.backend.model.service.interfaces;
import com.tucasa.backend.model.dto.DepartamentoRequestDto;

import org.springframework.http.ResponseEntity;

public interface DepartamentoService {
    ResponseEntity<?> findAll();
    ResponseEntity<?> create(DepartamentoRequestDto departamento);
}