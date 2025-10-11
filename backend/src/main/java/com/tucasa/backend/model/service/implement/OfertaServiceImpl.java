package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.Constants.Constants;
import com.tucasa.backend.model.dto.*;
import com.tucasa.backend.model.entity.*;
import com.tucasa.backend.model.repository.CasaRepository;
import com.tucasa.backend.model.repository.InmuebleRepository;
import com.tucasa.backend.model.repository.OfertaRepository;
import com.tucasa.backend.model.repository.ServicioRepository;
import com.tucasa.backend.model.service.interfaces.OfertaService;
import com.tucasa.backend.payload.ApiResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OfertaServiceImpl implements OfertaService {

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private CasaRepository casaRepository;

    @Autowired
    private InmuebleRepository inmuebleRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private ApiResponse apiResponse;

    @Override
    public ResponseEntity<?> findAll() {
        String successMessage = Constants.RECORDS_FOUND;
        String errorMessage = Constants.TABLE_NOT_FOUND;

        try {
            List<Oferta> ofertas = ofertaRepository.findAll();
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
            Oferta oferta = ofertaRepository.findById(id)
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
            // case LOTE -> ...
            // Etc.

            default -> throw new RuntimeException("Tipo de inmueble no soportado");
        }

        return inmueble;
    }



    // --- Mapeo a DTO ---
    private OfertaResponseDto mapToDto(Oferta oferta) {
        if (oferta == null) return null;

        InmuebleResponseDto inmuebleDto;

        Inmueble inmueble = oferta.getInmueble();
        if (inmueble instanceof Casa casa) {
            inmuebleDto = new CasaResponseDto(casa);
        }/*
        else if (inmueble instanceof Departamento depto) {
            inmuebleDto = new DepartamentoResponseDto(depto);
        } else if (inmueble instanceof Tienda tienda) {
            inmuebleDto = new TiendaResponseDto(tienda);
        } else if (inmueble instanceof Lote lote) {
            inmuebleDto = new LoteResponseDto(lote);
        } else if (inmueble instanceof Cuarto cuarto) {
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
