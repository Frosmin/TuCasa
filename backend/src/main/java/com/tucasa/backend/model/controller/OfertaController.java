package com.tucasa.backend.model.controller;

import com.tucasa.backend.model.dto.OfertaRequestDto;
import com.tucasa.backend.model.dto.OfertaResponseDto;
import com.tucasa.backend.model.service.interfaces.OfertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/oferta")
public class OfertaController {

    @Autowired
    private OfertaService ofertaService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        return ofertaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id, Authentication authentication) {
        return ofertaService.findById(id, authentication);
    }

    @PostMapping("")
    public ResponseEntity<?> create(@Validated(OfertaRequestDto.Create.class) @RequestBody OfertaRequestDto oferta) {
        return ofertaService.create(oferta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Validated(OfertaRequestDto.Update.class) @RequestBody OfertaRequestDto oferta) {
        return ofertaService.update(id, oferta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return ofertaService.delete(id);
    }

    @GetMapping("")
    public ResponseEntity<?> search(@RequestParam Map<String, String> params) {
        return ofertaService.search(params, false);
    }
         @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @RequestParam String estadoPublicacion) {
        return ofertaService.actualizarEstadoPublicacion(id, estadoPublicacion);
    }

    @PatchMapping("/{id}/propietario/estado")
    public ResponseEntity<?> actualizarEstadoMiPublicacion(
            @PathVariable Long id,
            @RequestParam String estadoPublicacion) {
        return ofertaService.actualizarEstadoMiPublicacion(id, estadoPublicacion);
    }

    @GetMapping("/map")
    public ResponseEntity<?> searchOnMap(@RequestParam Map<String, String> params) {
        return ofertaService.search(params, true);
    }

    // 

    @GetMapping("/propietario/{propietarioId}")
    public ResponseEntity<List<OfertaResponseDto>> getOfertasPorPropietario(@PathVariable Long propietarioId) {
        return (ResponseEntity<List<OfertaResponseDto>>) ofertaService.findByUserId(propietarioId);
    }
}
