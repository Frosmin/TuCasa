package com.tucasa.backend.model.controller;

import com.tucasa.backend.model.dto.ServicioResponseDto;
import com.tucasa.backend.model.service.interfaces.InmuebleService;
import com.tucasa.backend.model.service.interfaces.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/zonas")
public class ZonasController {

    @Autowired
    private InmuebleService inmuebleService;

    @GetMapping("/ofertas")
    public ResponseEntity<?> findZonasWithInmuebles() {
        return inmuebleService.getZonasWithInmuebles();
    }

}
