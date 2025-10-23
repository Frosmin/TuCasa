package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.entity.Departamento;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class DepartamentoResponseDto extends InmuebleResponseDto {

    private Integer numDormitorios;
    private Integer numBanos;
    private Integer piso;
    private BigDecimal montoExpensas;
    private Boolean mascotasPermitidas;
    private Boolean parqueo;
    private Boolean amoblado;
    private Boolean ascensor;
    private Boolean balcon;

    public DepartamentoResponseDto(Departamento departamento) {
        super(departamento);
        this.numDormitorios = departamento.getNumDormitorios();
        this.numBanos = departamento.getNumBanos();
        this.piso = departamento.getPiso();
        this.montoExpensas = departamento.getMontoExpensas();
        this.mascotasPermitidas = departamento.getMascotasPermitidas();
        this.parqueo = departamento.getParqueo();
        this.amoblado = departamento.getAmoblado();
        this.ascensor = departamento.getAscensor();
        this.balcon = departamento.getBalcon();
    }
}