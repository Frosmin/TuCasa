package com.tucasa.backend.model.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.tucasa.backend.model.entity.SolicitudAgente;
import com.tucasa.backend.model.service.implement.AgenteService;
import com.tucasa.backend.model.service.implement.SolicitudAgenteService;
import com.tucasa.backend.model.service.interfaces.UsuarioService;

@RestController
@RequestMapping("/api/agentes")
@CrossOrigin(origins = "*")
public class AgenteController {

    @Autowired
    private SolicitudAgenteService solicitudAgenteService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AgenteService agenteService;

    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitarAgente(
            @RequestParam Long usuarioId,
            @RequestParam String descripcion,
            @RequestParam String experiencia,
            @RequestParam(required = false) String matricula,
            @RequestParam("cv") MultipartFile cvFile
    ) {
        try {
            SolicitudAgente solicitud = solicitudAgenteService.crearSolicitud(
                usuarioId, descripcion, experiencia, matricula, cvFile
            );
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/toClient/{id}")
    public ResponseEntity<?> cambiarAgenteACliente(@PathVariable Long id){
        return usuarioService.volverACliente(id);
    }

    @GetMapping("/info/{id}")
    public ResponseEntity<?> datosAgente(@PathVariable Long id){
        return agenteService.infoAgente(id);
    }
}
