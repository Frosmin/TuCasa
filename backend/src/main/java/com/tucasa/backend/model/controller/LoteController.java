package com.tucasa.backend.model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tucasa.backend.model.dto.InmuebleRequestDto;
import com.tucasa.backend.model.dto.LoteRequestDto;
import com.tucasa.backend.model.service.interfaces.LoteService;

@RestController
@RequestMapping("/api/lotes")
public class LoteController {
    
    @Autowired
    private LoteService loteService;

    @PostMapping
    public ResponseEntity<?> create(@Validated(InmuebleRequestDto.Create.class) @RequestBody LoteRequestDto loteRequestDto) {
        return loteService.create(loteRequestDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return loteService.findById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Validated(LoteRequestDto.Update.class) @RequestBody LoteRequestDto lote) {
        return loteService.update(id, lote);
    }
}
