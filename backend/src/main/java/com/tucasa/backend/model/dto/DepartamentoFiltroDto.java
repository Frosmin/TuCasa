package com.tucasa.backend.model.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
public class DepartamentoFiltroDto {
    // private TipoInmueble tipo;
    private String operacion;
    private BigDecimal precioMn;
    private BigDecimal precioMx;
    private BigDecimal superficieMn;
    private BigDecimal superficieMx;
    private Integer numDormitorios;
    // private List<BigInteger> servicios;
}
