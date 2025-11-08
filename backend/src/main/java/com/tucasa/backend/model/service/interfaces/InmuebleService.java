package com.tucasa.backend.model.service.interfaces;


import com.tucasa.backend.model.dto.MultimediaRequestDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface InmuebleService {
    //Este es un crud basico de ejemplo,
    // estos servicios no seran usados necesariamente, son solo pruebas de la entidad
    ResponseEntity<?> findAll();
    ResponseEntity<?> getZonasWithInmuebles();
    ResponseEntity<?> findById(Long id);
    ResponseEntity<?> delete(Long id);
    ResponseEntity<?> updateMultimedia(Long inmuebleId, List<MultimediaRequestDto> multimediaDtos);

}
