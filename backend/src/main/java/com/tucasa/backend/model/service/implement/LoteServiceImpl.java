package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.Constants.Constants;
import com.tucasa.backend.model.dto.LoteRequestDto;
import com.tucasa.backend.model.dto.LoteResponseDto;
import com.tucasa.backend.model.dto.ServicioResponseDto;
import com.tucasa.backend.model.entity.Lote;
import com.tucasa.backend.model.entity.Servicio;
import com.tucasa.backend.model.enums.TipoInmueble;
import com.tucasa.backend.model.repository.LoteRepository;
import com.tucasa.backend.model.repository.ServicioRepository;
import com.tucasa.backend.model.service.interfaces.LoteService;
import com.tucasa.backend.payload.ApiResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;



@Service
public class LoteServiceImpl implements LoteService {
    @Autowired
    private LoteRepository loteRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private ApiResponse apiResponse;

    @Override
    @Transactional
    public ResponseEntity<?> create(LoteRequestDto dto) {
        try {
            Lote lote = new Lote();
            lote.setDireccion(dto.getDireccion());
            lote.setLatitud(dto.getLatitud());
            lote.setLongitud(dto.getLongitud());
            lote.setSuperficie(dto.getSuperficie());
            lote.setIdPropietario(dto.getIdPropietario());
            lote.setDescripcion(dto.getDescripcion());
            lote.setActivo(true);
            lote.setTipo(TipoInmueble.LOTE);
            lote.setTamanio(dto.getTamanio());
            lote.setMuroPerimetral(dto.getMuroPerimetral());

            if(dto.getServiciosIds() != null && !dto.getServiciosIds().isEmpty()){
                Set<Servicio> servicios = new HashSet<>(servicioRepository.findAllById(dto.getServiciosIds()));
                lote.setServicios(servicios);
            }

            Lote saved = loteRepository.save(lote);
            return apiResponse.responseCreate(Constants.RECORD_CREATED, mapToDto(saved));

        } catch (Exception e) {
            return apiResponse.responseDataError(Constants.RECORD_NOT_CREATED, e.getMessage());
        }

    }

    @Override
    @Transactional
    public ResponseEntity<?> findById(Long id) {
        String successMessage = Constants.RECORDS_FOUND;
        String errorMessage = "Lote no encontrado";
        try {
            Lote lote = loteRepository.findById(id).orElseThrow(() -> new RuntimeException(errorMessage));
            return apiResponse.responseSuccess(successMessage, mapToDto(lote));
        } catch (Exception e) {
            return apiResponse.responseNotFoundError(errorMessage, e.getMessage());
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> update(Long id, LoteRequestDto dto) {
        String successMessage = Constants.RECORD_UPDATED;
        String errorMessage = "lote no encontrado: "+ id;
        try {
            Lote lote = loteRepository.findById(id).orElseThrow(() -> new RuntimeException(errorMessage));

            if(dto.getDireccion() != null) {
                lote.setDireccion(dto.getDireccion());
            }
            if(dto.getLatitud() != null) {
                lote.setLatitud(dto.getLatitud());
            }
            if(dto.getLongitud() != null) {
                lote.setLongitud(dto.getLongitud());
            }
            if(dto.getSuperficie() != null) {
                lote.setSuperficie(dto.getSuperficie());
            }
            if(dto.getDescripcion() != null) {
                lote.setDescripcion(dto.getDescripcion());
            }
            if(dto.getActivo() != null) {
                lote.setActivo(dto.getActivo());
            }

            if(dto.getTamanio() != null) {
                lote.setTamanio(dto.getTamanio());
            }
            if(dto.getMuroPerimetral() != null) {
                lote.setMuroPerimetral(dto.getMuroPerimetral());
            }


            if(dto.getServiciosIds() != null && !dto.getServiciosIds().isEmpty()){
                Set<Servicio> servicios = new HashSet<>(servicioRepository.findAllById(dto.getServiciosIds()));
                lote.setServicios(servicios);
            }

            Lote updated = loteRepository.save(lote);
            return apiResponse.responseSuccess(successMessage, mapToDto(updated));
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }

    private LoteResponseDto mapToDto(Lote lote) {
        LoteResponseDto dto = new LoteResponseDto();
        dto.setId(lote.getId());
        dto.setDireccion(lote.getDireccion());
        dto.setLatitud(lote.getLatitud());
        dto.setLongitud(lote.getLongitud());
        dto.setSuperficie(lote.getSuperficie());
        dto.setIdPropietario(lote.getIdPropietario());
        dto.setDescripcion(lote.getDescripcion());
        dto.setActivo(lote.isActivo());
        dto.setTamanio(lote.getTamanio());
        dto.setMuroPerimetral(lote.isMuroPerimetral());

        if (lote.getServicios() != null) {
            Set<ServicioResponseDto> serviciosDtos = lote.getServicios().stream()
                    .map(servicio -> new ServicioResponseDto(servicio.getId(), servicio.getNombre()))
                    .collect(Collectors.toSet());
            dto.setServicios(serviciosDtos);
        }

        return dto;
    }
}
