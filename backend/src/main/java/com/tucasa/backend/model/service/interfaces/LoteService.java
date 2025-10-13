package com.tucasa.backend.model.service.interfaces;

import org.springframework.http.ResponseEntity;
import com.tucasa.backend.model.dto.LoteRequestDto;

public interface LoteService {
    ResponseEntity<?> create(LoteRequestDto inmueble);
    ResponseEntity<?> findById(Long id);
    ResponseEntity<?> update(Long id, LoteRequestDto dto); 
    

}
