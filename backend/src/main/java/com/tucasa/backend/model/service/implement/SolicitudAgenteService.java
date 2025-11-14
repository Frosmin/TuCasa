package com.tucasa.backend.model.service.implement;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tucasa.backend.model.entity.SolicitudAgente;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.TipoUsuario;
import com.tucasa.backend.model.enums.EstadoSolicitud; // ✅ Import del enum
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

        SolicitudAgente solicitud = new SolicitudAgente();
        solicitud.setUsuario(usuario);
        solicitud.setDescripcion(descripcion);
        solicitud.setExperiencia(experiencia);
        solicitud.setMatricula(matricula);
        solicitud.setCvPath(filePath.toString());
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);

        return solicitudRepository.save(solicitud);
    }

    public List<SolicitudAgente> listarTodas() {
        return solicitudRepository.findAll();
    }

    public List<SolicitudAgente> listarSolicitudesPendientes() {
        return solicitudRepository.findByEstado(EstadoSolicitud.PENDIENTE);
    }

    public void aprobarSolicitud(Long solicitudId) {
        SolicitudAgente solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada."));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("La solicitud ya fue procesada.");
        }

        solicitud.setEstado(EstadoSolicitud.APROBADA);
        solicitudRepository.save(solicitud);

        Usuario usuario = solicitud.getUsuario();
        usuario.setRol(TipoUsuario.AGENTE_INMOBILIARIO);
        usuarioRepository.save(usuario);
    }

    public void rechazarSolicitud(Long solicitudId) {
        SolicitudAgente solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada."));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("La solicitud ya fue procesada.");
        }

        solicitud.setEstado(EstadoSolicitud.RECHAZADA);
        solicitudRepository.save(solicitud);
    }

    public void eliminarSolicitud(Long solicitudId) {
        if (!solicitudRepository.existsById(solicitudId)) {
            throw new RuntimeException("Solicitud no encontrada.");
        }
        solicitudRepository.deleteById(solicitudId);
    }
}
