package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.Constants.Constants;
import com.tucasa.backend.model.entity.Servicio;
import com.tucasa.backend.model.repository.ServicioRepository;
import com.tucasa.backend.model.service.interfaces.ServicioService;
import com.tucasa.backend.payload.ApiResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioServiceImpl implements ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private ApiResponse apiResponse;

    @Override
    public ResponseEntity<?> findAll() {
        String successMessage = Constants.RECORDS_FOUND;
        String errorMessage = Constants.TABLE_NOT_FOUND;

        try {
            List<Servicio> servicios = servicioRepository.findAll();
            if (!servicios.isEmpty()) {
                return apiResponse.responseSuccess(successMessage, servicios);
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
        String errorMessage = "Servicio no encontrado";

        try {
            Servicio servicio = servicioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(errorMessage));
            return apiResponse.responseSuccess(successMessage, servicio);
        } catch (Exception e) {
            return apiResponse.responseNotFoundError(errorMessage, e.getMessage());
        }
    }
}
