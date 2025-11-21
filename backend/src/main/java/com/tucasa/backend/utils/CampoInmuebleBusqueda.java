package com.tucasa.backend.utils;

import java.util.HashMap;
import java.util.Map;

public enum CampoInmuebleBusqueda {

    // ---- Campos de texto ----
    TIPO_OPERACION("tipoOperacion", "o.tipo_operacion", TipoCampo.TEXTO),
    TIPO_INMUEBLE("tipoInmueble", "i.tipo_inmueble", TipoCampo.TEXTO),
    MONEDA("moneda", "o.moneda", TipoCampo.TEXTO),
    ZONA("zona", "i.zona", TipoCampo.TEXTO),
    DIRECCION("direccion", "i.direccion", TipoCampo.TEXTO),

    // ---- Campos numéricos ----
    NUM_DORMITORIOS("numDormitorios", "c.num_dormitorios", TipoCampo.NUMERICO),
    NUM_BANOS("numBanos", "c.num_banos", TipoCampo.NUMERICO),
    NUM_PISOS("numPisos", "c.num_pisos", TipoCampo.NUMERICO),
    NUM_AMBIENTES("numAmbientes", "t.num_ambientes", TipoCampo.NUMERICO),
    PRECIO_MIN("precioMin", "o.precio", TipoCampo.NUMERICO),
    PRECIO_MAX("precioMax", "o.precio", TipoCampo.NUMERICO),
    TAMANIO("tamanio", "l.tamanio", TipoCampo.NUMERICO),

    DEPTO_NUM_DORMITORIOS("deptoNumDormitorios", "d.num_dormitorios", TipoCampo.NUMERICO),
    DEPTO_NUM_BANOS("deptoNumBanos", "d.num_banos", TipoCampo.NUMERICO),
    DEPTO_PISO("deptoPiso", "d.piso", TipoCampo.NUMERICO),
    SUPERFICIE_INTERNA("superficieInterna", "d.superficie_interna", TipoCampo.NUMERICO),
    MONTO_EXPENSAS("montoExpensas", "d.monto_expensas", TipoCampo.NUMERICO),

    // ---- Campos booleanos ----
    GARAJE("garaje", "c.garaje", TipoCampo.BOOLEANO),
    PATIO("patio", "c.patio", TipoCampo.BOOLEANO),
    AMOBLADO("amoblado", "c.amoblado", TipoCampo.BOOLEANO),
    SOTANO("sotano", "c.sotano", TipoCampo.BOOLEANO),
    BANO_PRIVADO("banoPrivado", "t.bano_privado", TipoCampo.BOOLEANO),
    DEPOSITO("deposito", "t.deposito", TipoCampo.BOOLEANO),
    MURO_PERIMETRAL("muroPerimetral", "l.muro_perimetral", TipoCampo.BOOLEANO),

    MASCOTAS_PERMITIDAS("mascotasPermitidas", "d.mascotas_permitidas", TipoCampo.BOOLEANO),
    PARQUEO("parqueo", "d.parqueo", TipoCampo.BOOLEANO),
    DEPTO_AMOBLADO("deptoAmoblado", "d.amoblado", TipoCampo.BOOLEANO),
    ASCENSOR("ascensor", "d.ascensor", TipoCampo.BOOLEANO),
    BALCON("balcon", "d.balcon", TipoCampo.BOOLEANO);


    private final String param;
    private final String columna;
    private final TipoCampo tipo;

    CampoInmuebleBusqueda(String param, String columna, TipoCampo tipo) {
        this.param = param;
        this.columna = columna;
        this.tipo = tipo;
    }

    public String getParam() {
        return param;
    }

    public String getColumna() {
        return columna;
    }

    public TipoCampo getTipo() {
        return tipo;
    }

    private static final Map<String, CampoInmuebleBusqueda> LOOKUP = new HashMap<>();

    static {
        for (CampoInmuebleBusqueda campo : CampoInmuebleBusqueda.values()) {
            LOOKUP.put(campo.param, campo);
        }
    }

    public static CampoInmuebleBusqueda fromParam(String param) {
        return LOOKUP.get(param);
    }

    public enum TipoCampo {
        TEXTO, NUMERICO, BOOLEANO
    }
}