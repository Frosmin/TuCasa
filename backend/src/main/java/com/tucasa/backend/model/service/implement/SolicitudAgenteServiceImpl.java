package com.tucasa.backend.model.service.implement;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.apache.tomcat.util.bcel.classfile.Constant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.tucasa.backend.model.entity.SolicitudAgente;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.TipoUsuario;
import com.tucasa.backend.model.enums.EstadoSolicitud;
import com.tucasa.backend.model.repository.SolicitudAgenteRepository;
import com.tucasa.backend.model.repository.UsuarioRepository;
import com.tucasa.backend.model.service.interfaces.AgenteService;
import com.tucasa.backend.model.service.interfaces.SolicitudAgenteService;
import com.tucasa.backend.Constants.Constants;
import com.tucasa.backend.model.dto.AgenteRequestDto;
import com.tucasa.backend.model.dto.SolicitudAgenteRequestDto;
import com.tucasa.backend.model.dto.SolicitudAgenteResponseDto;
import com.tucasa.backend.model.dto.UsuarioResponseDto;
import com.tucasa.backend.payload.ApiResponse;

@Service
public class SolicitudAgenteServiceImpl implements SolicitudAgenteService {

    @Autowired
    private SolicitudAgenteRepository solicitudRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ApiResponse apiResponse;

    @Autowired
    private AgenteService agenteService;

    private static final String UPLOAD_DIR = "uploads/cv/";

    public SolicitudAgente create(Long usuarioId, String descripcion, String experiencia, String matricula, MultipartFile cvFile) throws IOException {
        if (solicitudRepository.existsByUsuarioId(usuarioId)) {
            throw new RuntimeException("Ya existe una solicitud pendiente o aprobada para este usuario.");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        // Normalizar y limpiar el nombre del archivo
        String originalFileName = cvFile.getOriginalFilename().replaceAll("\\s+", "_");
        String fileName = "CV_" + usuarioId + "_" + originalFileName;

        // Crear directorio absoluto seguro
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        Path filePath = uploadPath.resolve(fileName);
        cvFile.transferTo(filePath.toFile());

        String publicUrl = "http://localhost:8000/tucasabackend/uploads/cv/" + fileName;
        SolicitudAgente solicitud = new SolicitudAgente();
        solicitud.setUsuario(usuario);
        solicitud.setDescripcion(descripcion);
        solicitud.setExperiencia(experiencia);
        solicitud.setMatricula(matricula);
        solicitud.setCvPath(publicUrl);
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);

        return solicitudRepository.save(solicitud);
    }


    private SolicitudAgenteResponseDto mapToDto(SolicitudAgente solicitud) {
        if (solicitud == null)
            return null;

        Usuario usuario = solicitud.getUsuario();
        UsuarioResponseDto usuarioDto = new UsuarioResponseDto(usuario);

        SolicitudAgenteResponseDto solicitudDto = new SolicitudAgenteResponseDto(
                solicitud.getId(),
                usuarioDto,
                solicitud.getDescripcion(),
                solicitud.getExperiencia(),
                solicitud.getMatricula(),
                solicitud.getCvPath(),
                solicitud.getEstado(),
                solicitud.getFechaSolicitud());

        return solicitudDto;

    }

    @Override
    public ResponseEntity<?> findAll() {
        String successMessage = Constants.RECORDS_FOUND;
        String errorMessage = Constants.TABLE_NOT_FOUND;

        try {
            List<SolicitudAgente> solicitudes = solicitudRepository.findAll();
            if (!solicitudes.isEmpty()) {
                List<SolicitudAgenteResponseDto> response = solicitudes.stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());

                return apiResponse.responseSuccess(successMessage, response);
            } else {
                return apiResponse.responseDataError(errorMessage, null);
            }
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e);
        }
    }

    @Override
    public ResponseEntity<?> findPendig() {
        String successMessage = Constants.RECORDS_FOUND;
        String errorMessage = Constants.TABLE_NOT_FOUND;

        try {
            List<SolicitudAgente> solicitudes = solicitudRepository.findByEstado(EstadoSolicitud.PENDIENTE);
            ;
            if (!solicitudes.isEmpty()) {
                List<SolicitudAgenteResponseDto> response = solicitudes.stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());

                return apiResponse.responseSuccess(successMessage, response);
            } else {
                return apiResponse.responseDataError(errorMessage, null);
            }
        } catch (Exception e) {
            return apiResponse.responseDataError(errorMessage, e);
        }

    }

    @Override
    public ResponseEntity<?> aproveRequest(Long solicitudId) {
        try {
            SolicitudAgente solicitud = solicitudRepository.findById(solicitudId).orElse(null);

            if (solicitud == null) {
                return apiResponse.responseDataError("Solicitud no encontrada", null);
            }

            if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
                return apiResponse.responseDataError("La solicitud ya fue procesada", null);
            }

            solicitud.setEstado(EstadoSolicitud.APROBADA);
            solicitudRepository.save(solicitud);

            Usuario usuario = solicitud.getUsuario();
            usuario.setRol(TipoUsuario.AGENTE_INMOBILIARIO);
            usuarioRepository.save(usuario);
            
            createAgente(solicitud);


            return apiResponse.responseSuccess("Solicitud aprobada correctamente", null);

        } catch (Exception e) {
            return apiResponse.responseDataError("No se pudo aprobar la solicitud", e.getMessage());
        }
    }

    private void createAgente(SolicitudAgente solicitud) {
        AgenteRequestDto dto = new AgenteRequestDto();
        dto.setUsuario(solicitud.getUsuario());
        dto.setDescripcion(solicitud.getDescripcion());
        dto.setExperiencia(solicitud.getExperiencia());
        dto.setMatricula(solicitud.getMatricula());
        dto.setCv(solicitud.getCvPath());

        agenteService.create(dto);
    }

    @Override
    public ResponseEntity<?> rejectRequest(Long solicitudId) {
        try {
            SolicitudAgente solicitud = solicitudRepository.findById(solicitudId).orElse(null);

            if(solicitud == null) {
                return apiResponse.responseDataError("Solicitud no encontrada", null);
            }

            if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
                return apiResponse.responseDataError("La solicitud ya fue procesada", null);
            }

            solicitud.setEstado(EstadoSolicitud.RECHAZADA);
            solicitudRepository.save(solicitud);

            return apiResponse.responseSuccess("Solicitud rechazada correctamente", null);

        } catch (Exception e) {
            return apiResponse.responseDataError("No se pudo rechazar la solicitud", e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> deleteRequest(Long solicitudId) {
        try {
            if (!solicitudRepository.existsById(solicitudId)) {
                return apiResponse.responseDataError("Solicitud no encontrada", null);
            }

            solicitudRepository.deleteById(solicitudId);

            return apiResponse.responseSuccess("Solicitud eliminada correctamente", null);

        } catch (Exception e) {
            return apiResponse.responseDataError("No se pudo eliminar la solicitud", e.getMessage());
        }
    }
}
