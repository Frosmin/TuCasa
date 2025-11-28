package com.tucasa.backend.model.service.interfaces;

import org.springframework.http.ResponseEntity;

import com.tucasa.backend.model.dto.AgenteRequestDto;

public interface AgenteService {
    ResponseEntity<?> findAll();
    ResponseEntity<?> findById(Long id);
    ResponseEntity<?> create(AgenteRequestDto dto);
    ResponseEntity<?> delete(Long id);
}
