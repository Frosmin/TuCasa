package com.tucasa.backend.model.service.interfaces;

import org.springframework.http.ResponseEntity;
import com.tucasa.backend.model.dto.AvaluoRequestDto;
import com.tucasa.backend.model.enums.TipoAvaluo;


public interface AvaluoService {
    ResponseEntity<?> create(AvaluoRequestDto dto, String userEmail);
    ResponseEntity<?> getPendientes(String userEmail);
    ResponseEntity<?> asignarAgente(Long idAgente, Long idAvaluo);
    ResponseEntity<?> getAllAvaluos();
    ResponseEntity<?> getAvaluosPorAgente(Long idAgente);
    ResponseEntity<?> getAvaluoById(Long id);
    ResponseEntity<?> actualizarEstado(Long id, TipoAvaluo nuevoEstado);
}
