package com.tucasa.backend.model.dto;

import com.tucasa.backend.model.entity.Tienda;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class TiendaResponseDto extends InmuebleResponseDto {

    private Integer numAmbientes;

    private Boolean banoPrivado;

    private Boolean deposito;


    public TiendaResponseDto(Tienda tienda) {
        super(tienda);
        this.numAmbientes = tienda.getNumAmbientes();
        this.banoPrivado = tienda.getBanoPrivado();
        this.deposito = tienda.getDeposito();
    }

}
