package com.tucasa.backend.model.service.interfaces;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.tucasa.backend.model.dto.SolicitudAgenteRequestDto;
import com.tucasa.backend.model.entity.SolicitudAgente;

public interface SolicitudAgenteService {
    //SolicitudAgente create(Long usuarioId, String descripcion, String experiencia, String matricula, MultipartFile cvFile);
    ResponseEntity<?> findAll();
    ResponseEntity<?> findPendig();
    ResponseEntity<?> aproveRequest(Long solicitudId);
    ResponseEntity<?> rejectRequest(Long solicitudId);
    ResponseEntity<?> deleteRequest(Long solicitudId);

} 
