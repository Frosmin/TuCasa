package com.tucasa.backend.model.controller;

import com.tucasa.backend.model.dto.InmuebleRequestDto;
import com.tucasa.backend.model.dto.InmuebleResponseDto;
import com.tucasa.backend.model.dto.MultimediaRequestDto;
import com.tucasa.backend.model.entity.Inmueble;
import com.tucasa.backend.model.service.interfaces.InmuebleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/inmueble")
public class InmuebleController {

    @Autowired
    private InmuebleService inmuebleService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return inmuebleService.findAll();
    }

    @GetMapping("/propietario/{id}")
    public ResponseEntity<?> findOwnerById(@PathVariable Long id) {
        return inmuebleService.findOwnerById(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return inmuebleService.findById(id);
    }

    @PutMapping("/{id}/multimedia")
    public ResponseEntity<?> updateMultimedia(@PathVariable Long id, @RequestBody List<MultimediaRequestDto> multimedia) {
        return inmuebleService.updateMultimedia(id, multimedia);
    }
    

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return inmuebleService.delete(id);
    }
}
