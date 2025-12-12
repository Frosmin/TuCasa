package com.tucasa.backend.model.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.tucasa.backend.model.dto.AsignarAgenteRequestDto;
import com.tucasa.backend.model.dto.AvaluoRequestDto;
import com.tucasa.backend.model.dto.AvaluoUpdateEstadoDto;
import com.tucasa.backend.model.service.interfaces.AvaluoService;

@RestController
@RequestMapping("api/oferta/avaluo")
public class AvaluoController {

    @Autowired
    private AvaluoService avaluoService;

    // Crear nuevo avalúo
    @PostMapping("")
    public ResponseEntity<?> create(@Validated @RequestBody AvaluoRequestDto avaluoRequestDto,
                                    Principal principal) {
        return avaluoService.create(avaluoRequestDto, principal.getName());
    }

    // Listar avalúos en progreso
    @GetMapping("/lista/en-progreso")
    public ResponseEntity<?> getEnProgreso(Principal principal) {
        return avaluoService.getPendientes(principal.getName());
    }

    // Listar todos los avalúos
    @GetMapping("/lista/todos")
    public ResponseEntity<?> getTodos() {
        return avaluoService.getAllAvaluos();
    }

    // Listar avalúos de un agente específico
    @GetMapping("/lista/agente/{idAgente}")
    public ResponseEntity<?> getPorAgente(@PathVariable Long idAgente) {
        return avaluoService.getAvaluosPorAgente(idAgente);
    }

    // Obtener avalúo por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAvaluoById(@PathVariable Long id) {
        return avaluoService.getAvaluoById(id);
    }

    // Actualizar estado de un avalúo (esto dispara la notificación en el service)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @RequestBody AvaluoUpdateEstadoDto request) {
        return avaluoService.actualizarEstado(id, request.getNuevoEstado());
    }

    // Asignar un agente a un avalúo
    @PostMapping("/asignar-agente")
    public ResponseEntity<?> asignarAgente(@RequestBody AsignarAgenteRequestDto request) {
        return avaluoService.asignarAgente(request.getIdAgente(), request.getIdAvaluo());
    }
}
