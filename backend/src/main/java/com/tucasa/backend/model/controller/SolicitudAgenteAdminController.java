package com.tucasa.backend.model.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.tucasa.backend.model.entity.SolicitudAgente;
import com.tucasa.backend.model.enums.EstadoSolicitud;
import com.tucasa.backend.model.service.implement.SolicitudAgenteServiceImpl;
import com.tucasa.backend.model.service.interfaces.SolicitudAgenteService;

@RestController
@RequestMapping("/api/admin/solicitudes/agentes")
//@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class SolicitudAgenteAdminController {

    @Autowired
    private SolicitudAgenteService solicitudService;

    @GetMapping
    public ResponseEntity<?> findAll() {
        return solicitudService.findAll();
    }

    @GetMapping("/pendientes")
    public ResponseEntity<?> findPending() {
        return solicitudService.findPendig();
    }

    @PutMapping("/{id}/aprobar")
    public ResponseEntity<?> aproveRequest(@PathVariable Long id) {
        return solicitudService.aproveRequest(id);
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        return solicitudService.rejectRequest(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        return solicitudService.deleteRequest(id);
    }
}
