package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.Constants.Constants;
import com.tucasa.backend.model.dto.InmuebleRequestDto;
import com.tucasa.backend.model.dto.InmuebleResponseDto;
import com.tucasa.backend.model.dto.MultimediaRequestDto;
import com.tucasa.backend.model.dto.ServicioResponseDto;
import com.tucasa.backend.model.entity.Inmueble;
import com.tucasa.backend.model.entity.Multimedia;
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
                return apiResponse.responseSuccess(successMessage, inmuebles);
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
            return apiResponse.responseSuccess(successMessage, inmueble);
        } catch (Exception e) {
            return apiResponse.responseNotFoundError(errorMessage, e.getMessage());
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


    @Override
    @Transactional
    public ResponseEntity<?> updateMultimedia(Long inmuebleId, List<MultimediaRequestDto> multimediaDtos) {
        String successMessage = "Multimedia actualizada correctamente";
        String errorMessage = "No se pudo actualizar la multimedia";

        try {
            Inmueble inmueble = inmuebleRepository.findById(inmuebleId)
                    .orElseThrow(() -> new RuntimeException("Inmueble no encontrado con id: " + inmuebleId));

            // Limpiar la lista existente para activar orphanRemoval
            inmueble.getMultimedias().clear();

            // Añadir las nuevas multimedias
            if (multimediaDtos != null && !multimediaDtos.isEmpty()) {
                for (MultimediaRequestDto dto : multimediaDtos) {
                    Multimedia multimedia = new Multimedia();
                    multimedia.setUrl(dto.getUrl());
                    multimedia.setMultimedia(dto.getTipo());
                    multimedia.setDescripcion(dto.getDescripcion());
                    multimedia.setEs_portada(dto.getEsPortada());
                    multimedia.setActivo(true);
                    multimedia.setInmueble(inmueble);
                    inmueble.getMultimedias().add(multimedia);
                }
            }

            Inmueble updatedInmueble = inmuebleRepository.save(inmueble);
            return apiResponse.responseSuccess(successMessage, mapToDto(updatedInmueble));

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
