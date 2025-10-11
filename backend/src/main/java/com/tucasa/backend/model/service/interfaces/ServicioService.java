package com.tucasa.backend.model.service.interfaces;

import com.tucasa.backend.model.entity.Servicio;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface ServicioService {
    ResponseEntity<?> findAll();
    ResponseEntity<?> findById(Long id);
}
