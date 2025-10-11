package com.tucasa.backend.model.controller;

import com.tucasa.backend.model.dto.CasaRequestDto;
import com.tucasa.backend.model.dto.CasaRequestDto;
import com.tucasa.backend.model.service.interfaces.CasaService;
import com.tucasa.backend.model.service.interfaces.InmuebleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/casa")
public class CasaController {

    @Autowired
    private CasaService casaService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return casaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return casaService.findById(id);
    }

    @PostMapping("")
    public ResponseEntity<?> create(@Validated(CasaRequestDto.Create.class) @RequestBody CasaRequestDto casa) {
        return casaService.create(casa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Validated(CasaRequestDto.Update.class) @RequestBody CasaRequestDto casa) {
        return casaService.update(id, casa);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return casaService.delete(id);
    }
}
