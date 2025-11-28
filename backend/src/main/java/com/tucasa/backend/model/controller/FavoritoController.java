package com.tucasa.backend.model.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.tucasa.backend.model.dto.FavoritoRequestDto;
import com.tucasa.backend.model.service.interfaces.FavoritoService;

@RestController
@RequestMapping("api/oferta/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @PostMapping("")
    public ResponseEntity<?> create(@Validated @RequestBody FavoritoRequestDto favoritoRequestDto,
                                    Principal principal) {
        return favoritoService.create(favoritoRequestDto, principal.getName());
    }

    @DeleteMapping("")
    public ResponseEntity<?> delete(@Validated @RequestBody FavoritoRequestDto favoritoRequestDto,
                                    Principal principal) {
        // Ignora usuarioId si llega; usa el del token
        return favoritoService.delete(favoritoRequestDto, principal.getName());
    }

    // @GetMapping("")
    // public ResponseEntity<?> listMine(Principal principal) {
    //     return favoritoService.findByUsuarioEmail(principal.getName());
    // }
}