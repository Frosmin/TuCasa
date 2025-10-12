package com.tucasa.backend.model.service.interfaces;

import com.tucasa.backend.model.dto.OfertaRequestDto;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface OfertaService {
    ResponseEntity<?> findAll();
    ResponseEntity<?> findById(Long id);
    ResponseEntity<?> create(OfertaRequestDto oferta);
    ResponseEntity<?> update(Long id, OfertaRequestDto oferta);
    ResponseEntity<?> delete(Long id);
    ResponseEntity<?> search(Map<String, String> params);
}
