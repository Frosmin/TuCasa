package com.tucasa.backend.model.controller;

import com.tucasa.backend.model.service.interfaces.ServicioService;
import com.tucasa.backend.utils.RoleName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/servicio")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return servicioService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return servicioService.findById(id);
    }
}
