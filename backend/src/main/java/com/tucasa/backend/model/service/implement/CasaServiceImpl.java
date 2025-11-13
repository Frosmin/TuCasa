package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.Constants.Constants;
import com.tucasa.backend.model.dto.*;
import com.tucasa.backend.model.entity.Casa;
import com.tucasa.backend.model.entity.Casa;
import com.tucasa.backend.model.entity.Servicio;
import com.tucasa.backend.model.repository.CasaRepository;
import com.tucasa.backend.model.repository.CasaRepository;
import com.tucasa.backend.model.repository.InmuebleRepository;
import com.tucasa.backend.model.repository.ServicioRepository;
import com.tucasa.backend.model.service.interfaces.CasaService;
import com.tucasa.backend.model.service.interfaces.CasaService;
import com.tucasa.backend.payload.ApiResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CasaServiceImpl implements CasaService {

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
            List<Casa> casas = casaRepository.findAll();
            if (!casas.isEmpty()) {
                List<CasaResponseDto> dtos = casas.stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
                return apiResponse.responseSuccess(successMessage, dtos);
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
        String errorMessage = "Casa no encontrada";

        try {
            Casa casa = casaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(errorMessage));
            return apiResponse.responseSuccess(successMessage, mapToDto(casa));
        } catch (Exception e) {
            return apiResponse.responseNotFoundError(errorMessage, e.getMessage());
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> create(CasaRequestDto dto) {
        String successMessage = Constants.RECORD_CREATED;
        String errorMessage = Constants.RECORD_NOT_CREATED;

        try {
            Casa casa = new Casa();
            casa.setDireccion(dto.getDireccion());
            casa.setLatitud(dto.getLatitud());
            casa.setLongitud(dto.getLongitud());
            casa.setSuperficie(dto.getSuperficie());
            casa.setIdPropietario(dto.getIdPropietario());
            casa.setDescripcion(dto.getDescripcion());
            casa.setActivo(true);
            casa.setTipo(dto.getTipo());

            casa.setNumDormitorios(dto.getNumDormitorios());
            casa.setNumBanos(dto.getNumBanos());
            casa.setNumPisos(dto.getNumPisos());
            casa.setGaraje(dto.getGaraje());
            casa.setPatio(dto.getPatio());
            casa.setAmoblado(dto.getAmoblado());
            casa.setSotano(dto.getSotano());

            if (dto.getServiciosIds() != null && !dto.getServiciosIds().isEmpty()) {
                Set<Servicio> servicios = new HashSet<>(servicioRepository.findAllById(dto.getServiciosIds()));
                casa.setServicios(servicios);
            }

            Casa saved = casaRepository.save(casa);
            return apiResponse.responseCreate(successMessage, mapToDto(saved));

        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }


    @Override
    @Transactional
    public ResponseEntity<?> update(Long id, CasaRequestDto dto) {
        String successMessage = Constants.RECORD_UPDATED;
        String errorMessage = "Casa no encontrada: " + id;

        try {
            Casa casa = casaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(errorMessage));

            // Actualiza solo los campos que vienen no nulos
            if (dto.getDireccion() != null) casa.setDireccion(dto.getDireccion());
            if (dto.getLatitud() != null) casa.setLatitud(dto.getLatitud());
            if (dto.getLongitud() != null) casa.setLongitud(dto.getLongitud());
            if (dto.getSuperficie() != null) casa.setSuperficie(dto.getSuperficie());
            if (dto.getDescripcion() != null) casa.setDescripcion(dto.getDescripcion());
            if (dto.getTipo() != null) casa.setTipo(dto.getTipo());
            if (dto.getActivo() != null) casa.setActivo(dto.getActivo());

            // Campos unicos de la casa
            if (dto.getNumDormitorios() != null) casa.setNumDormitorios(dto.getNumDormitorios());
            if (dto.getNumBanos() != null) casa.setNumBanos(dto.getNumBanos());
            if (dto.getNumPisos() != null) casa.setNumPisos(dto.getNumPisos());
            if (dto.getGaraje() != null) casa.setGaraje(dto.getGaraje());
            if (dto.getPatio() != null) casa.setPatio(dto.getPatio());
            if (dto.getAmoblado() != null) casa.setAmoblado(dto.getAmoblado());
            if (dto.getSotano() != null) casa.setSotano(dto.getSotano());

            // Actualiza la lista de servicios
            if (dto.getServiciosIds() != null && !dto.getServiciosIds().isEmpty()) {
                Set<Servicio> servicios = new HashSet<>(servicioRepository.findAllById(dto.getServiciosIds()));
                casa.setServicios(servicios);
            }

            Casa updated = casaRepository.save(casa);
            return apiResponse.responseSuccess(successMessage, mapToDto(updated));

        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }


    @Override
    @Transactional
    public ResponseEntity<?> delete(Long id) {
        String successMessage = Constants.RECORD_DELETED;
        String errorMessage = "Casa no encontrada: " + id;

        try {
            Casa casa = casaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(errorMessage));

            casa.setActivo(false);
            casaRepository.save(casa);

            return apiResponse.responseSuccess(successMessage, null);
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }

    // --- Mapeo a DTO ---
    private CasaResponseDto mapToDto(Casa casa) {
        CasaResponseDto dto = new CasaResponseDto();
        dto.setId(casa.getId());
        dto.setDireccion(casa.getDireccion());
        dto.setLatitud(casa.getLatitud());
        dto.setLongitud(casa.getLongitud());
        dto.setSuperficie(casa.getSuperficie());
        dto.setIdPropietario(casa.getIdPropietario());
        dto.setDescripcion(casa.getDescripcion());
        dto.setActivo(casa.isActivo());
        dto.setTipo(casa.getTipo());

        // --- Mapear lista de servicios a DTO ---
        if (casa.getServicios() != null && !casa.getServicios().isEmpty()) {
            Set<ServicioResponseDto> serviciosDto = casa.getServicios().stream()
                    .map(s -> new ServicioResponseDto(s.getId(), s.getNombre()))
                    .collect(Collectors.toSet());
            dto.setServicios(serviciosDto);
        }

        // Datos de casa
        dto.setNumDormitorios(casa.getNumDormitorios());
        dto.setNumBanos(casa.getNumBanos());
        dto.setNumPisos(casa.getNumPisos());
        dto.setGaraje(casa.getGaraje());
        dto.setPatio(casa.getPatio());
        dto.setAmoblado(casa.getAmoblado());
        dto.setSotano(casa.getSotano());

        return dto;
    }
}
