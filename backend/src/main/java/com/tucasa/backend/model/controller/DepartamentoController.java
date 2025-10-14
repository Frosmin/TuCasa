package com.tucasa.backend.model.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;

import com.tucasa.backend.model.dto.DepartamentoFiltroDto;
import com.tucasa.backend.model.dto.DepartamentoRequestDto;
import com.tucasa.backend.model.enums.TipoOperacion;
import com.tucasa.backend.model.service.interfaces.DepartamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("api/departamentos")
public class DepartamentoController {


    @Autowired
    private DepartamentoService departamentoService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return departamentoService.findAll();
    }
    
    

    @PostMapping("")
    public ResponseEntity<?> create(@Validated(DepartamentoRequestDto.Create.class) @RequestBody DepartamentoRequestDto departamento) {
        return departamentoService.create(departamento);
    }

    @GetMapping("/filtrar2")
    public ResponseEntity<?> filtrarDepartamentos(
            @RequestParam(name = "op",required = false) String op,
            @RequestParam(name = "mn",required = false) BigDecimal mn,
            @RequestParam(name = "mx",required = false) BigDecimal mx,
            @RequestParam(name = "smn",required = false) BigDecimal smn,
            @RequestParam(name = "smx",required = false) BigDecimal smx,
            @RequestParam(name = "nd",required = false) Integer nd
    ) {
        DepartamentoFiltroDto filtro = new DepartamentoFiltroDto();
        filtro.setOperacion(op);
        filtro.setPrecioMn(mn);
        filtro.setPrecioMx(mx);
        filtro.setSuperficieMn(smn);
        filtro.setSuperficieMx(smx);
        filtro.setNumDormitorios(nd);

        return departamentoService.filtrar2(filtro);
    }
}
