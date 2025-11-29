package com.tucasa.backend.model.dto;
import com.tucasa.backend.model.enums.EstadoSolicitud;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudAgenteRequestDto {
    public interface Create {}
    public interface Update {}

    private Long usuarioId;
    private String descripcion;
    private String experiencia;
    private String matricula;

    @NotNull(message = "El cv es obligatorio", groups = Create.class)
    private MultipartFile cvPath;
    
}
