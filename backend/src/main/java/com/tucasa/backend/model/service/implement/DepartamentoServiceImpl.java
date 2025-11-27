package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.Constants.Constants;
import com.tucasa.backend.model.dto.DepartamentoRequestDto;
import com.tucasa.backend.model.dto.DepartamentoResponseDto;
import com.tucasa.backend.model.dto.ServicioResponseDto;
import com.tucasa.backend.model.entity.Departamento;
import com.tucasa.backend.model.entity.Servicio;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.repository.DepartamentoRepository;
import com.tucasa.backend.model.repository.ServicioRepository;
import com.tucasa.backend.model.service.interfaces.DepartamentoService;
import com.tucasa.backend.payload.ApiResponse;
import com.tucasa.backend.utils.PropietarioMapper;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DepartamentoServiceImpl implements DepartamentoService {

    @Autowired
    private DepartamentoRepository departamentoRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private ApiResponse apiResponse;

    @Autowired
    private PropietarioMapper propietarioMapper;
    
    @Override
    public ResponseEntity<?> findAll() {
        try {
            List<Departamento> departamentos = departamentoRepository.findAll();
            if (!departamentos.isEmpty()) {
                List<DepartamentoResponseDto> dtos = departamentos.stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
                return apiResponse.responseSuccess(Constants.RECORDS_FOUND, dtos);
            } else {
                return apiResponse.responseSuccess(Constants.NO_RECORDS, List.of());
            }
        } catch (Exception e) {
            return apiResponse.responseDataError(Constants.TABLE_NOT_FOUND, e.getMessage());
        }
    }

    private DepartamentoResponseDto mapToDto(Departamento departamento) {
        DepartamentoResponseDto dto = new DepartamentoResponseDto(departamento);
        if (departamento.getServicios() != null && !departamento.getServicios().isEmpty()) {
            Set<ServicioResponseDto> serviciosDto = departamento.getServicios().stream()
                    .map(s -> new ServicioResponseDto(s.getId(), s.getNombre()))
                    .collect(Collectors.toSet());
            dto.setServicios(serviciosDto);
        }
        return dto;
    }


    @Override
    @Transactional
    public ResponseEntity<?> create(DepartamentoRequestDto dto) {
        String successMessage = Constants.RECORD_CREATED;
        String errorMessage = Constants.RECORD_NOT_CREATED;

        try {
            Usuario propietario = propietarioMapper.getPropietarioEntity(dto.getIdPropietario());
            Departamento departamento = new Departamento();
            departamento.setDireccion(dto.getDireccion());
            departamento.setLatitud(dto.getLatitud());
            departamento.setLongitud(dto.getLongitud());
            departamento.setSuperficie(dto.getSuperficie());
            departamento.setPropietario(propietario);
            departamento.setDescripcion(dto.getDescripcion());
            departamento.setActivo(true);
            departamento.setTipo(dto.getTipo());

            departamento.setNumDormitorios(dto.getNumDormitorios());
            departamento.setNumBanos(dto.getNumBanos());
            departamento.setPiso(dto.getPiso());
            departamento.setSuperficieInterna(dto.getSuperficieInterna());
            departamento.setMontoExpensas(dto.getMontoExpensas());
            departamento.setMascotasPermitidas(dto.getMascotasPermitidas());
            departamento.setParqueo(dto.getParqueo());
            departamento.setAmoblado(dto.getAmoblado());
            departamento.setAscensor(dto.getAscensor());
            departamento.setBalcon(dto.getBalcon());
            

            // Lista de servicios
            if (dto.getServiciosIds() != null && !dto.getServiciosIds().isEmpty()) {
                Set<Servicio> servicios = new HashSet<>(servicioRepository.findAllById(dto.getServiciosIds()));
                departamento.setServicios(servicios);
            }

            Departamento saved = departamentoRepository.save(departamento);
            return apiResponse.responseCreate(successMessage, mapToDto(saved));

        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e.getMessage());
        }
    }

}