package com.tucasa.backend.model.service.interfaces;

import org.springframework.http.ResponseEntity;
import com.tucasa.backend.model.dto.AvaluoRequestDto;


public interface AvaluoService {
    ResponseEntity<?> create(AvaluoRequestDto dto, String userEmail);
    ResponseEntity<?> getPendientes(String userEmail);
}
