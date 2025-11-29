package com.tucasa.backend.model.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.endpoint.web.annotation.WebEndpoint;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tucasa.backend.model.dto.AsignarAgenteRequestDto;
import com.tucasa.backend.model.dto.AvaluoRequestDto;
import com.tucasa.backend.model.dto.AvaluoUpdateEstadoDto;
import com.tucasa.backend.model.service.interfaces.AvaluoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("api/oferta/avaluo")
public class AvaluoController {
    @Autowired
    private AvaluoService avaluoService;

    @PostMapping("")
    public ResponseEntity<?> create(@Validated @RequestBody AvaluoRequestDto avaluoRequestDto,
                                    Principal principal) {
        return avaluoService.create(avaluoRequestDto, principal.getName());
    }

    @GetMapping("/lista/pendientes")
    public ResponseEntity<?> getPendientes(Principal principal) {
        return avaluoService.getPendientes(principal.getName());
    }
    
    @GetMapping("/lista/todos")
    public ResponseEntity<?> getTodos() {
        return avaluoService.getAllAvaluos();
    }
    
    @GetMapping("/lista/agente/{idAgente}")
    public ResponseEntity<?> getPorAgente(@PathVariable Long idAgente) {
        return avaluoService.getAvaluosPorAgente(idAgente);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getAvaluoById(@PathVariable Long id) {
        return avaluoService.getAvaluoById(id);
    }
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @RequestBody AvaluoUpdateEstadoDto request) {

        return avaluoService.actualizarEstado(id, request.getNuevoEstado());
    }


    @PostMapping("/asignarAgente")
    public ResponseEntity<?> asignarAgente (@RequestBody AsignarAgenteRequestDto request) {
        return avaluoService.asignarAgente(request.getIdAgente(), request.getIdAvaluo());
    }
}
