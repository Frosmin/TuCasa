package com.tucasa.backend.model.service.interfaces;

import com.tucasa.backend.model.dto.FavoritoRequestDto;
import org.springframework.http.ResponseEntity;

public interface FavoritoService {
    ResponseEntity<?> create(FavoritoRequestDto dto, String userEmail);
    ResponseEntity<?> delete(FavoritoRequestDto dto, String userEmail);
    ResponseEntity<?> findByUsuarioEmail(String userEmail);
}