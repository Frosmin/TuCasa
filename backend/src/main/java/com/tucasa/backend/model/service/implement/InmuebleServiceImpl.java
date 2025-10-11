package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.Constants.Constants;
import com.tucasa.backend.model.dto.InmuebleRequestDto;
import com.tucasa.backend.model.dto.InmuebleResponseDto;
import com.tucasa.backend.model.dto.ServicioResponseDto;
import com.tucasa.backend.model.entity.Inmueble;
import com.tucasa.backend.model.entity.Servicio;
import com.tucasa.backend.model.repository.InmuebleRepository;
import com.tucasa.backend.model.repository.ServicioRepository;
import com.tucasa.backend.model.service.interfaces.InmuebleService;
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
public class InmuebleServiceImpl implements InmuebleService {

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
            List<Inmueble> inmuebles = inmuebleRepository.findAll();
            if (!inmuebles.isEmpty()) {
                List<InmuebleResponseDto> dtos = inmuebles.stream()
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
        String errorMessage = "Inmueble no encontrado";

        try {
            Inmueble inmueble = inmuebleRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(errorMessage));
            return apiResponse.responseSuccess(successMessage, mapToDto(inmueble));
        } catch (Exception e) {
            return apiResponse.responseNotFoundError(errorMessage, e.getMessage());
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> create(InmuebleRequestDto dto) {
        String successMessage = Constants.RECORD_CREATED;
        String errorMessage = Constants.RECORD_NOT_CREATED;

        try {
            Inmueble inmueble = new Inmueble();
            inmueble.setDireccion(dto.getDireccion());
            inmueble.setSuperficie(dto.getSuperficie());
            inmueble.setIdPropietario(dto.getIdPropietario());
            inmueble.setFechaPublicacion(LocalDateTime.now());
            inmueble.setEstadoPublicacion(dto.getEstadoPublicacion());
            inmueble.setDescripcion(dto.getDescripcion());
            inmueble.setActivo(true);
            inmueble.setTipo(dto.getTipo());

            // Lista de servicios
            if (dto.getServiciosIds() != null && !dto.getServiciosIds().isEmpty()) {
                Set<Servicio> servicios = new HashSet<>(servicioRepository.findAllById(dto.getServiciosIds()));
                inmueble.setServicios(servicios);
            }

            Inmueble saved = inmuebleRepository.save(inmueble);
            return apiResponse.responseCreate(successMessage, mapToDto(saved));

        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }


    @Override
    @Transactional
    public ResponseEntity<?> update(Long id, InmuebleRequestDto dto) {
        String successMessage = Constants.RECORD_UPDATED;
        String errorMessage = "Inmueble no encontrado: " + id;

        try {
            Inmueble inmueble = inmuebleRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(errorMessage));

            // Actualiza solo los campos que vienen no nulos
            if (dto.getDireccion() != null) inmueble.setDireccion(dto.getDireccion());
            if (dto.getSuperficie() != null) inmueble.setSuperficie(dto.getSuperficie());
            if (dto.getEstadoPublicacion() != null) inmueble.setEstadoPublicacion(dto.getEstadoPublicacion());
            if (dto.getDescripcion() != null) inmueble.setDescripcion(dto.getDescripcion());
            if (dto.getTipo() != null) inmueble.setTipo(dto.getTipo());
            if (dto.getActivo() != null) inmueble.setActivo(dto.getActivo());

            // Actualiza la lista de servicios
            if (dto.getServiciosIds() != null && !dto.getServiciosIds().isEmpty()) {
                Set<Servicio> servicios = new HashSet<>(servicioRepository.findAllById(dto.getServiciosIds()));
                inmueble.setServicios(servicios);
            }

            Inmueble updated = inmuebleRepository.save(inmueble);
            return apiResponse.responseSuccess(successMessage, mapToDto(updated));

        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }


    @Override
    @Transactional
    public ResponseEntity<?> delete(Long id) {
        String successMessage = Constants.RECORD_DELETED;
        String errorMessage = "Inmueble no encontrado: " + id;

        try {
            Inmueble inmueble = inmuebleRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(errorMessage));

            inmueble.setActivo(false);
            inmuebleRepository.save(inmueble);

            return apiResponse.responseSuccess(successMessage, null);
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }

    // --- Mapeo a DTO ---
    private InmuebleResponseDto mapToDto(Inmueble inmueble) {
        InmuebleResponseDto dto = new InmuebleResponseDto();
        dto.setId(inmueble.getId());
        dto.setDireccion(inmueble.getDireccion());
        dto.setSuperficie(inmueble.getSuperficie());
        dto.setIdPropietario(inmueble.getIdPropietario());
        dto.setFechaPublicacion(inmueble.getFechaPublicacion());
        dto.setEstadoPublicacion(inmueble.getEstadoPublicacion());
        dto.setDescripcion(inmueble.getDescripcion());
        dto.setActivo(inmueble.isActivo());
        dto.setTipo(inmueble.getTipo());

        // --- Mapear lista de servicios a DTO ---
        if (inmueble.getServicios() != null && !inmueble.getServicios().isEmpty()) {
            Set<ServicioResponseDto> serviciosDto = inmueble.getServicios().stream()
                    .map(s -> new ServicioResponseDto(s.getId(), s.getNombre()))
                    .collect(Collectors.toSet());
            dto.setServicios(serviciosDto);
        }

        return dto;
    }
}
