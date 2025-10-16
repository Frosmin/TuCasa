package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.Constants.Constants;
import com.tucasa.backend.model.dto.*;
import com.tucasa.backend.model.entity.*;
import com.tucasa.backend.model.repository.*;
import com.tucasa.backend.model.service.interfaces.OfertaService;
import com.tucasa.backend.payload.ApiResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OfertaServiceImpl implements OfertaService {

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private CasaRepository casaRepository;

    @Autowired
    private TiendaRepository tiendaRepository;

    @Autowired
    private LoteRepository loteRepository;

    @Autowired
    private InmuebleRepository inmuebleRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private ApiResponse apiResponse;

    @Autowired
    private EntityManager entityManager;

    @Override
    public ResponseEntity<?> findAll() {
        String successMessage = Constants.RECORDS_FOUND;
        String errorMessage = Constants.TABLE_NOT_FOUND;

        try {
            List<Oferta> ofertas = ofertaRepository.findAllCompleto();
            if (!ofertas.isEmpty()) {
                List<OfertaResponseDto> response = ofertas.stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
                return apiResponse.responseSuccess(successMessage, response);
            } else {
                return apiResponse.responseDataError(errorMessage, null);
            }
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> findById(Long id) {
        String successMessage = Constants.RECORDS_FOUND;
        String errorMessage = "Oferta no encontrada";

        try {
            Oferta oferta = ofertaRepository.findCompletoById(id)
                    .orElseThrow(() -> new RuntimeException(errorMessage));
            return apiResponse.responseSuccess(successMessage, mapToDto(oferta));
        } catch (Exception e) {
            return apiResponse.responseNotFoundError(errorMessage, e.getMessage());
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> create(OfertaRequestDto dto) {
        try {
            // Llamada a funcion auxiliar
            System.out.println(dto.getInmueble());
            Inmueble inmueble = createInmuebleByDto(dto.getInmueble());

            Oferta oferta = new Oferta();
            oferta.setInmueble(inmueble);
            oferta.setDescripcion(dto.getDescripcion());
            oferta.setTipo(dto.getTipo());
            oferta.setPrecio(dto.getPrecio());
            oferta.setMoneda(dto.getMoneda());
            oferta.setDuracion(dto.getDuracion());
            oferta.setTipoPago(dto.getTipoPago());

            oferta.setEstadoPublicacion("En revision");

            oferta.setActivo(true);

            Oferta ofertaSaved = ofertaRepository.save(oferta);

            return apiResponse.responseCreate(Constants.RECORD_CREATED, mapToDto(ofertaSaved));
        } catch (Exception e) {
            return apiResponse.responseDataError(Constants.RECORD_NOT_CREATED, e.getMessage());
        }
    }


    @Override
    @Transactional
    public ResponseEntity<?> update(Long ofertaId, OfertaRequestDto dto) {
        String successMessage = Constants.RECORD_UPDATED;
        String errorMessage = "Oferta no encontrada: " + ofertaId;

        try {
            Oferta oferta = ofertaRepository.findById(ofertaId)
                    .orElseThrow(() -> new RuntimeException(errorMessage));

            // Actualiza solo los campos no nulos
            if (dto.getDescripcion() != null) oferta.setDescripcion(dto.getDescripcion());
            if (dto.getTipo() != null) oferta.setTipo(dto.getTipo());
            if (dto.getPrecio() != null) oferta.setPrecio(dto.getPrecio());
            if (dto.getMoneda() != null) oferta.setMoneda(dto.getMoneda());
            if (dto.getDuracion() != null) oferta.setDuracion(dto.getDuracion());
            if (dto.getTipoPago() != null) oferta.setTipoPago(dto.getTipoPago());
            if (dto.getFechaPublicacionInicio() != null)
                oferta.setFechaPublicacionInicio(dto.getFechaPublicacionInicio());
            if (dto.getFechaPublicacionFin() != null)
                oferta.setFechaPublicacionFin(dto.getFechaPublicacionFin());
            if (dto.getEstadoPublicacion() != null) oferta.setEstadoPublicacion(dto.getEstadoPublicacion());
            if (dto.getActivo() != null) oferta.setActivo(dto.getActivo());

            Oferta updated = ofertaRepository.save(oferta);

            // Update inmueble pendiente

            return apiResponse.responseSuccess(successMessage, mapToDto(updated));
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }


    @Override
    @Transactional
    public ResponseEntity<?> delete(Long id) {
        String successMessage = Constants.RECORD_DELETED;
        String errorMessage = "Oferta no encontrada: " + id;

        try {
            Oferta oferta = ofertaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(errorMessage));

            oferta.setActivo(false);
            ofertaRepository.save(oferta);

            return apiResponse.responseSuccess(successMessage, null);
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }



    private Inmueble createInmuebleByDto(InmuebleRequestDto dto) {
        System.out.println("Tipo: "+ dto.getTipo());
        if (dto.getTipo() == null) {
            throw new RuntimeException("El tipo de inmueble es obligatorio");
        }

        Inmueble inmueble;

        switch (dto.getTipo()) {
            case CASA -> {
                Casa casa = new Casa();
                casa.setDireccion(dto.getDireccion());
                casa.setSuperficie(dto.getSuperficie());
                casa.setLongitud(dto.getLongitud());
                casa.setLatitud(dto.getLatitud());
                casa.setIdPropietario(dto.getIdPropietario());
                casa.setDescripcion(dto.getDescripcion());
                casa.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
                casa.setTipo(dto.getTipo());

                if (dto instanceof CasaRequestDto casaDto) {
                    casa.setNumDormitorios(casaDto.getNumDormitorios());
                    casa.setNumBanos(casaDto.getNumBanos());
                    casa.setNumPisos(casaDto.getNumPisos());
                    casa.setGaraje(casaDto.getGaraje() != null && casaDto.getGaraje());
                    casa.setPatio(casaDto.getPatio() != null && casaDto.getPatio());
                    casa.setAmoblado(casaDto.getAmoblado() != null && casaDto.getAmoblado());
                    casa.setSotano(casaDto.getSotano() != null && casaDto.getSotano());
                }

                if (dto.getServiciosIds() != null && !dto.getServiciosIds().isEmpty()) {
                    Set<Servicio> servicios = new HashSet<>(servicioRepository.findAllById(dto.getServiciosIds()));
                    casa.setServicios(servicios);
                }

                inmueble = casaRepository.save(casa);
            }

            case TIENDA -> {
                Tienda tienda = new Tienda();
                tienda.setDireccion(dto.getDireccion());
                tienda.setSuperficie(dto.getSuperficie());
                tienda.setLongitud(dto.getLongitud());
                tienda.setLatitud(dto.getLatitud());
                tienda.setIdPropietario(dto.getIdPropietario());
                tienda.setDescripcion(dto.getDescripcion());
                tienda.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
                tienda.setTipo(dto.getTipo());

                if (dto instanceof TiendaRequestDto tiendaDto) {
                    tienda.setNumAmbientes(tiendaDto.getNumAmbientes());
                    tienda.setBanoPrivado(tiendaDto.getBanoPrivado());
                    tienda.setDeposito(tiendaDto.getDeposito());
                }

                if (dto.getServiciosIds() != null && !dto.getServiciosIds().isEmpty()) {
                    Set<Servicio> servicios = new HashSet<>(servicioRepository.findAllById(dto.getServiciosIds()));
                    tienda.setServicios(servicios);
                }

                inmueble = tiendaRepository.save(tienda);
            }

            // Definir la construcción para los otros tipos de inmueble
            /*
            case DEPARTAMENTO -> {
                Departamento departamento = new Departamento();
                departamento.setDireccion(dto.getDireccion());
                departamento.setSuperficie(dto.getSuperficie());
                departamento.setLongitud(dto.getLongitud());
                departamento.setLatitud(dto.getLatitud());
                departamento.setIdPropietario(dto.getIdPropietario());
                departamento.setDescripcion(dto.getDescripcion());
                departamento.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
                departamento.setTipo(dto.getTipo());

                if (dto instanceof DepartamentoRequestDto departamentoDto) {
                    // settear para el resto de campos unicos del departamento
                }

                if (dto.getServiciosIds() != null && !dto.getServiciosIds().isEmpty()) {
                    Set<Servicio> servicios = new HashSet<>(servicioRepository.findAllById(dto.getServiciosIds()));
                    casa.setServicios(servicios);
                }

                inmueble = casaRepository.save(casa);
            }
             */
            // case TIENDA -> ...
            case LOTE -> {
                Lote lote = new Lote();
                lote.setDireccion(dto.getDireccion());
                lote.setSuperficie(dto.getSuperficie());
                lote.setLongitud(dto.getLongitud());
                lote.setLatitud(dto.getLatitud());
                lote.setIdPropietario(dto.getIdPropietario());
                lote.setDescripcion(dto.getDescripcion());
                lote.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
                lote.setTipo(dto.getTipo());

                if (dto instanceof LoteRequestDto loteDto) {
                    lote.setTamanio(loteDto.getTamanio());
                    lote.setMuroPerimetral(loteDto.getMuroPerimetral() != null && loteDto.getMuroPerimetral());
                }

                if (dto.getServiciosIds() != null && !dto.getServiciosIds().isEmpty()) {
                    Set<Servicio> servicios = new HashSet<>(servicioRepository.findAllById(dto.getServiciosIds()));
                    lote.setServicios(servicios);
                }

                inmueble = loteRepository.save(lote);
            }
            // Etc.

            default -> throw new RuntimeException("Tipo de inmueble no soportado");
        }

        return inmueble;
    }

    @Override
    public ResponseEntity<?> search(Map<String, String> params) {
        // Consulta base en SQL nativo - Complementar con los tipos de inmueble
        StringBuilder sql = new StringBuilder(
                "SELECT o.id " +
                "FROM ofertas o " +
                "INNER JOIN inmuebles i ON o.id_inmueble = i.id " +
                "LEFT JOIN casas c ON i.id = c.id " +
                "LEFT JOIN tiendas t ON i.id = t.id " +
                // LEFT JOIN departamento d ON i.id = d.id " +
                "LEFT JOIN lotes l ON i.id = l.id " +
                "WHERE o.activo = true AND i.activo = true ");

        // Campos permitidos para filtro por tipos - Complementar con los tipos de inmueble
        Map<String, String> camposTexto = Map.of(
                "tipoOperacion", "o.tipo_operacion",
                "tipoInmueble", "i.tipo_inmueble"
        );

        Map<String, String> camposNumericos = Map.of(
                "numDormitorios", "c.num_dormitorios",
                "numBanos", "c.num_banos",
                "numPisos", "c.num_pisos",
                "numAmbientes", "t.num_ambientes",
                "precioMin", "o.precio",
                "precioMax", "o.precio",
                "tamanio", "l.tamanio"
        );

        Map<String, String> camposBooleanos = Map.of(
                "garaje", "c.garaje",
                "patio", "c.patio",
                "amoblado", "c.amoblado",
                "sotano", "c.sotano",
                "banoPrivado", "t.bano_privado",
                "deposito", "t.deposito",
                "muroPerimetral", "l.muro_perimetral"

        );

        // Aplicar filtros por campos
        for (var entry : params.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            // Si el campo viene sin valor se ignora
            if (value == null || value.isBlank()) continue;

            if (camposTexto.containsKey(key)) {     // Se construye el AND WHERE para texto
                sql.append(" AND ").append(camposTexto.get(key))
                        .append(" ILIKE '%").append(value.replace("'", "''")).append("%'"); // Busca coincidencias con ILIKE
            } else if (camposNumericos.containsKey(key)) {  // Construye para campos numericos
                try {
                    BigDecimal num = new BigDecimal(value);
                    String campo = camposNumericos.get(key);
                    if (key.equals("precioMin")) sql.append(" AND ").append(campo).append(" >= ").append(value);    // Para rango de precios
                    else if (key.equals("precioMax")) sql.append(" AND ").append(campo).append(" <= ").append(value);
                    else sql.append(" AND ").append(campo).append(" = ").append(value); // Para cualquier numero (dormitorios por ejemplo)
                } catch (NumberFormatException ignored) {}
            } else if (camposBooleanos.containsKey(key)) {  // Contruye AND WHERE para booleanos (Si tiene deposito, sotano, garaje, etc.)
                if (value.equalsIgnoreCase("true") || value.equalsIgnoreCase("false"))
                    sql.append(" AND ").append(camposBooleanos.get(key)).append(" = ").append(value);
            }
        }

        // Filtrado por proximidad - Tendria que ser obligatorio (No interesa recibir ofertas fuera del rango escogido)
        Double latitud = params.containsKey("latitud") ? Double.valueOf(params.get("latitud")) : null;
        Double longitud = params.containsKey("longitud") ? Double.valueOf(params.get("longitud")) : null;
        Double proximidad = params.containsKey("proximidad") ? Double.valueOf(params.get("proximidad")) : null;

        if (latitud != null && longitud != null && proximidad != null) {
            sql.append(" AND (")
                    .append("6371 * acos(")
                    .append("cos(radians(").append(latitud).append(")) * cos(radians(i.latitud)) * ")
                    .append("cos(radians(i.longitud) - radians(").append(longitud).append(")) + ")
                    .append("sin(radians(").append(latitud).append(")) * sin(radians(i.latitud))")
                    .append(")")
                    .append(") <= ").append(proximidad);
        }

        // Ordenamiento
        String orderBy = params.get("orderBy");

        Map<String, String> camposOrdenables = Map.of(
                "precio", "o.precio",
                "fechaPublicacionInicio", "o.fecha_publicacion_inicio",
                "fechaPublicacionFin", "o.fecha_publicacion_fin"
        );

        if (orderBy != null && !orderBy.isBlank()) {
            String[] parts = orderBy.split(",");
            String campo = parts[0].trim();
            String direccion = (parts.length > 1 ? parts[1].trim() : "asc").toUpperCase();

            if (!direccion.equals("ASC") && !direccion.equals("DESC")) {
                direccion = "DESC";
            }

            if (camposOrdenables.containsKey(campo)) {
                sql.append(" ORDER BY ").append(camposOrdenables.get(campo))
                        .append(" ").append(direccion);
            } else {
                sql.append(" ORDER BY o.fecha_publicacion_inicio DESC");
            }
        } else {
            sql.append(" ORDER BY o.fecha_publicacion_inicio DESC");
        }

        System.out.println("SQL generada: " + sql);

        // Consulta nativa de los ids
        Query query = entityManager.createNativeQuery(sql.toString());
        List<Long> ofertaIds = query.getResultList().stream()
                .map(id -> ((Number) id).longValue())
                .toList();

        if (ofertaIds.isEmpty()) {
            return apiResponse.responseSuccess(Constants.RECORDS_FOUND, List.of());
        }

        // Logica para mapeo de subtipos (no funciona con sql nativo)
        List<Oferta> resultados = ofertaRepository.findAllCompletoByIds(ofertaIds);

        // Conservar el orden
        Map<Long, Oferta> ofertasFinded = resultados.stream()
                .collect(Collectors.toMap(Oferta::getId, Function.identity()));

        List<Oferta> ofertasList = ofertaIds.stream()
                .map(ofertasFinded::get)
                .filter(Objects::nonNull)
                .toList();

        List<OfertaResponseDto> response = ofertasList.stream().map(this::mapToDto).toList();
        return apiResponse.responseSuccess(Constants.RECORDS_FOUND, response);
    }


    // --- Mapeo a DTO ---
    private OfertaResponseDto mapToDto(Oferta oferta) {
        if (oferta == null) return null;

        InmuebleResponseDto inmuebleDto;

        Inmueble inmueble = oferta.getInmueble();
        if (inmueble instanceof Casa casa) {
            inmuebleDto = new CasaResponseDto(casa);
        }/*
        else if (inmueble instanceof Departamento departamento) {
            inmuebleDto = new DepartamentoResponseDto(departamento);
        }*/ else if (inmueble instanceof Tienda tienda) {
            inmuebleDto = new TiendaResponseDto(tienda);
        }else if (inmueble instanceof Lote lote) {
            inmuebleDto = new LoteResponseDto(lote);
        } /*  else if (inmueble instanceof Cuarto cuarto) {
            inmuebleDto = new CuartoResponseDto(cuarto);
        }*/ else {
            inmuebleDto = new InmuebleResponseDto(inmueble);
        }

        OfertaResponseDto dto = new OfertaResponseDto();
        dto.setId(oferta.getId());
        dto.setInmueble(inmuebleDto);
        dto.setDescripcion(oferta.getDescripcion());
        dto.setTipo(oferta.getTipo());
        dto.setPrecio(oferta.getPrecio());
        dto.setMoneda(oferta.getMoneda());
        dto.setDuracion(oferta.getDuracion());
        dto.setTipoPago(oferta.getTipoPago());
        dto.setFechaPublicacionInicio(oferta.getFechaPublicacionInicio());
        dto.setFechaPublicacionFin(oferta.getFechaPublicacionFin());
        dto.setEstadoPublicacion(oferta.getEstadoPublicacion());
        dto.setActivo(oferta.isActivo());

        return dto;
    }
}
