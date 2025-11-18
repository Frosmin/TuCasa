package com.tucasa.backend.model.service.interfaces;

import com.tucasa.backend.model.dto.OfertaRequestDto;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import java.util.Map;

public interface OfertaService {
    ResponseEntity<?> findAll();
    ResponseEntity<?> findById(Long id, Authentication authentication);
    ResponseEntity<?> create(OfertaRequestDto oferta);
    ResponseEntity<?> update(Long id, OfertaRequestDto oferta);
    ResponseEntity<?> delete(Long id);

    ResponseEntity<?> actualizarEstadoPublicacion(Long id, String estadoPublicacion);
    ResponseEntity<?> search(Map<String, String> params, Boolean compact);
    ResponseEntity<?> findByUserId(Long id);
}
