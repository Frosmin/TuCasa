package com.tucasa.backend.model.service.implement;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tucasa.backend.model.entity.SolicitudAgente;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.EstadoSolicitud; 
import com.tucasa.backend.model.repository.SolicitudAgenteRepository;
import com.tucasa.backend.model.repository.UsuarioRepository;

@Service
public class SolicitudAgenteService {

    @Autowired
    private SolicitudAgenteRepository solicitudRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private static final String UPLOAD_DIR = "uploads/cv/";

    public SolicitudAgente crearSolicitud(Long usuarioId, String descripcion, String experiencia, String matricula, MultipartFile cvFile) throws IOException {
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

   }
