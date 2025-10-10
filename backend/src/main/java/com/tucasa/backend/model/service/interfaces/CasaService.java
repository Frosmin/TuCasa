package com.tucasa.backend.model.service.interfaces;

import com.tucasa.backend.model.dto.CasaRequestDto;
import com.tucasa.backend.model.dto.InmuebleRequestDto;
import org.springframework.http.ResponseEntity;

public interface CasaService {
    ResponseEntity<?> findAll();
    ResponseEntity<?> findById(Long id);
    ResponseEntity<?> create(CasaRequestDto casa);
    ResponseEntity<?> update(Long id, CasaRequestDto casa);
    ResponseEntity<?> delete(Long id);
}
