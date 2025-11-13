package com.tucasa.backend.model.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tucasa.backend.model.entity.SolicitudAgente;
import com.tucasa.backend.model.enums.EstadoSolicitud;
import com.tucasa.backend.model.service.implement.SolicitudAgenteService;

@RestController
@RequestMapping("/api/admin/solicitudes/agentes") // 🚀 Cambiado para evitar conflicto
@CrossOrigin(origins = "*")
public class SolicitudAgenteAdminController {

    @Autowired
    private SolicitudAgenteService solicitudAgenteService;

    @GetMapping
    public ResponseEntity<List<SolicitudAgente>> listarTodas() {
        return ResponseEntity.ok(solicitudAgenteService.listarTodas());
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<SolicitudAgente>> listarPendientes() {
        return ResponseEntity.ok(solicitudAgenteService.listarSolicitudesPendientes());
    }

    @PutMapping("/{id}/aprobar")
    public ResponseEntity<String> aprobar(@PathVariable Long id) {
        solicitudAgenteService.aprobarSolicitud(id);
        return ResponseEntity.ok("Solicitud aprobada correctamente.");
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<String> rechazar(@PathVariable Long id) {
        solicitudAgenteService.rechazarSolicitud(id);
        return ResponseEntity.ok("Solicitud rechazada correctamente.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        solicitudAgenteService.eliminarSolicitud(id);
        return ResponseEntity.ok("Solicitud eliminada correctamente.");
    }
}
