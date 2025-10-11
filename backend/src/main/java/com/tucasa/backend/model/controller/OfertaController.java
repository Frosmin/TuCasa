package com.tucasa.backend.model.controller;

import com.tucasa.backend.model.dto.OfertaRequestDto;
import com.tucasa.backend.model.service.interfaces.OfertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/oferta")
public class OfertaController {

    @Autowired
    private OfertaService ofertaService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return ofertaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ofertaService.findById(id);
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
}
