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

import com.tucasa.backend.model.dto.AvaluoRequestDto;
import com.tucasa.backend.model.service.interfaces.AvaluoService;
import org.springframework.web.bind.annotation.GetMapping;
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

}
