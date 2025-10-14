package com.tucasa.backend.model.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
public class DepartamentoOfertaDto {
    // Campos de Departamento
    private Long departamentoId;
    private Integer numDormitorios;
    private Integer numBanos;
    private Integer piso;
    private BigDecimal superficieInterna;
    private BigDecimal montoExpensas;
    private Boolean mascotasPermitidas;
    private Boolean parqueo;
    private Boolean amoblado;
    private Boolean ascensor;
    private Boolean balcon;

    // Campos de Oferta
    private Long ofertaId;
    private BigDecimal precio;
    private String tipoOperacion;
    private String descripcion;

    // Constructor completo
    public DepartamentoOfertaDto(Object[] row) {
        this.departamentoId = ((Number) row[0]).longValue();
        this.numDormitorios = (Integer) row[1];
        this.numBanos = (Integer) row[2];
        this.piso = (Integer) row[3];
        this.superficieInterna = (BigDecimal) row[4];
        this.montoExpensas = (BigDecimal) row[5];
        this.mascotasPermitidas = (Boolean) row[6];
        this.parqueo = (Boolean) row[7];
        this.amoblado = (Boolean) row[8];
        this.ascensor = (Boolean) row[9];
        this.balcon = (Boolean) row[10];

        // Oferta puede ser null
        this.ofertaId = row[11] != null ? ((Number) row[11]).longValue() : null;
        this.precio = (BigDecimal) row[12];
        this.tipoOperacion = (String) row[13];
        this.descripcion = (String) row[14];
    }
}
