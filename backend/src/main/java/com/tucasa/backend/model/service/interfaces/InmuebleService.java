package com.tucasa.backend.model.service.interfaces;

import com.tucasa.backend.model.dto.InmuebleRequestDto;
import com.tucasa.backend.model.entity.Inmueble;
import org.springframework.http.ResponseEntity;

public interface InmuebleService {
    //Este es un crud basico de ejemplo,
    // estos servicios no seran usados necesariamente, son solo pruebas de la entidad
    ResponseEntity<?> findAll();
    ResponseEntity<?> findById(Long id);
    ResponseEntity<?> create(InmuebleRequestDto inmueble);
    ResponseEntity<?> update(Long id, InmuebleRequestDto inmueble);
    ResponseEntity<?> delete(Long id);
}
