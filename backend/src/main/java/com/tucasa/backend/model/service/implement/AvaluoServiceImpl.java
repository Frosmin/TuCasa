package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.model.dto.AvaluoRequestDto;
import com.tucasa.backend.model.dto.AvaluoResponseDto;
import com.tucasa.backend.model.entity.Avaluo;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.TipoAvaluo;
import com.tucasa.backend.model.enums.TipoUsuario;
import com.tucasa.backend.model.repository.AvaluoRepository;
import com.tucasa.backend.model.repository.UsuarioRepository;
import com.tucasa.backend.model.service.interfaces.AvaluoService;
import com.tucasa.backend.model.service.interfaces.NotificacionService;
import com.tucasa.backend.payload.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvaluoServiceImpl implements AvaluoService {

    @Autowired
    private AvaluoRepository avaluoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ApiResponse apiResponse;

    @Autowired
    private NotificacionService notificacionService;  
   @Override
    public ResponseEntity<?> create(AvaluoRequestDto dto, String userEmail) {
        var usuarioOpt = usuarioRepository.findByCorreo(userEmail);
        if (usuarioOpt.isEmpty()) {
            return apiResponse.responseNotFoundError("Usuario no encontrado", null);
        }

        try {
            Usuario usuario = usuarioOpt.get();
            Avaluo avaluo = new Avaluo();

            avaluo.setUsuario(usuario);
            avaluo.setTipo(dto.getTipoInmueble());
            avaluo.setCelular_Contacto(dto.getCelularContacto());

            avaluo.setLatitud(dto.getLatitud());
            avaluo.setLongitud(dto.getLongitud());

            avaluo.setDireccion(dto.getDireccion());

            avaluo.setTipoAvaluo(TipoAvaluo.POR_ASIGNAR);

            avaluoRepository.save(avaluo);

            // ---- AGREGAR NOTIFICACIÓN ----
            try {
                notificacionService.notificarCambioEstado(avaluo);
                System.out.println("Notificación enviada correctamente");
            } catch (Exception e) {
                System.out.println("Error enviando notificación: " + e.getMessage());
            }

            return apiResponse.responseCreate("Avalúo creado correctamente", new AvaluoResponseDto(avaluo));
        } catch (Exception e) {
            return apiResponse.responseDataError("Error al crear la solicitud de avalúo", e.getMessage());
        }
    }


    @Override
    public ResponseEntity<?> getPendientes(String userEmail) {
        var usuarioOpt = usuarioRepository.findByCorreo(userEmail);
        if (usuarioOpt.isEmpty()) {
            return apiResponse.responseNotFoundError("Usuario no encontrado", null);
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.getRol() != TipoUsuario.AGENTE_INMOBILIARIO) {
            return apiResponse.responseDataError("No tienes permisos para ver esta información", null);
        }

        try {
            List<Avaluo> pendientes = avaluoRepository.findByTipoAvaluo(TipoAvaluo.POR_ASIGNAR);

            List<AvaluoResponseDto> dtos = pendientes.stream()
                    .map(AvaluoResponseDto::new)
                    .collect(Collectors.toList());

            return apiResponse.responseSuccess("Avalúos en progreso encontrados", dtos);
        } catch (Exception e) {
            return apiResponse.responseDataError("Error al buscar avalúos en progreso", e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getAllAvaluos() {
        try {
            List<Avaluo> lista = avaluoRepository.findAll();

            List<AvaluoResponseDto> dtos = lista.stream()
                    .map(AvaluoResponseDto::new)
                    .collect(Collectors.toList());

            return apiResponse.responseSuccess("Todos los avalúos encontrados", dtos);
        } catch (Exception e) {
            return apiResponse.responseDataError("Error al obtener los avalúos", e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getAvaluosPorAgente(Long idAgente) {
        try {
            List<Avaluo> lista = avaluoRepository.findByAgente_Id(idAgente);

            List<AvaluoResponseDto> dtos = lista.stream()
                    .map(AvaluoResponseDto::new)
                    .collect(Collectors.toList());

            return apiResponse.responseSuccess("Avalúos del agente encontrados", dtos);
        } catch (Exception e) {
            return apiResponse.responseDataError("Error al obtener los avalúos del agente", e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getAvaluoById(Long id) {
        try {
            var optAvaluo = avaluoRepository.findById(id);
            if (optAvaluo.isEmpty()) {
                return apiResponse.responseNotFoundError("Avalúo no encontrado", null);
            }
            AvaluoResponseDto dto = new AvaluoResponseDto(optAvaluo.get());
            return apiResponse.responseSuccess("Avalúo encontrado", dto);
        } catch (Exception e) {
            return apiResponse.responseDataError("Error al obtener avalúo", e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> actualizarEstado(Long id, TipoAvaluo nuevoEstado) {
        var optAvaluo = avaluoRepository.findById(id);

        if (optAvaluo.isEmpty()) {
            return apiResponse.responseNotFoundError("Avalúo no encontrado", null);
        }

        try {
            Avaluo avaluo = optAvaluo.get();
            avaluo.setTipoAvaluo(nuevoEstado);
            avaluoRepository.save(avaluo);

            notificacionService.notificarCambioEstado(avaluo);

            return apiResponse.responseSuccess("Estado actualizado correctamente", new AvaluoResponseDto(avaluo));
        } catch (Exception e) {
            return apiResponse.responseDataError("Error al actualizar estado", e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> asignarAgente(Long idAgente, Long idAvaluo) {
        try {
            Usuario agente = usuarioRepository.findById(idAgente)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Avaluo av = avaluoRepository.findById(idAvaluo)
                    .orElseThrow(() -> new RuntimeException("Avalúo no encontrado"));

            av.setAgente(agente);

            if (av.getTipoAvaluo() != TipoAvaluo.EN_PROGRESO && av.getTipoAvaluo() != TipoAvaluo.COMPLETADO) {
                av.setTipoAvaluo(TipoAvaluo.EN_PROGRESO);
            }

            avaluoRepository.save(av);

            return apiResponse.responseSuccess("Se asignó al agente al avalúo", null);
        } catch (Exception e) {
            return apiResponse.responseDataError("No se pudo asignar al agente al avalúo", e.getMessage());
        }
    }
}
