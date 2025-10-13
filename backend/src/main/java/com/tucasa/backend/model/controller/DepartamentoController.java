package com.tucasa.backend.model.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.tucasa.backend.model.service.interfaces.DepartamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("api/departamento")
public class DepartamentoController {


    @Autowired
    private DepartamentoService departamentoService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return departamentoService.findAll();
    }
    
    
}
