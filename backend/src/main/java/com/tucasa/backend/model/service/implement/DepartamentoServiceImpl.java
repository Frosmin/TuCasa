package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.Constants.Constants;
import com.tucasa.backend.model.dto.DepartamentoResponseDto;
import com.tucasa.backend.model.dto.ServicioResponseDto;
import com.tucasa.backend.model.entity.Departamento;
import com.tucasa.backend.model.repository.DepartamentoRepository;
import com.tucasa.backend.model.service.interfaces.DepartamentoService;
import com.tucasa.backend.payload.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DepartamentoServiceImpl implements DepartamentoService {

    @Autowired
    private DepartamentoRepository departamentoRepository;

    @Autowired
    private ApiResponse apiResponse;

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
}