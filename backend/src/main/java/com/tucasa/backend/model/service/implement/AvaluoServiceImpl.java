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

    @Override
    public ResponseEntity<?> create(AvaluoRequestDto dto, String userEmail) {
        var usuarioOpt = usuarioRepository.findByCorreo(userEmail);
        if (usuarioOpt.isEmpty()) {
            return apiResponse.responseNotFoundError("Usuario no encontrado", null);
        }
        try {
            var usuario = usuarioOpt.get();;
            Avaluo avaluo = new Avaluo();

            avaluo.setUsuario(usuario);
            avaluo.setTipo(dto.getTipoInmueble());
            avaluo.setCelular_Contacto(dto.getCelularContacto());
            avaluo.setLatitud(dto.getLatitud());
            avaluo.setLongitud(dto.getLongitud());
            avaluo.setDireccion(dto.getDireccion());
            
        
            avaluo.setTipoAvaluo(TipoAvaluo.PENDIENTE);

            avaluoRepository.save(avaluo);
            
            return apiResponse.responseCreate("Avaluo creado correctamente", null);
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

        try {   //busca los pendientes
            List<Avaluo> pendientes = avaluoRepository.findByTipoAvaluo(TipoAvaluo.PENDIENTE);


            List<AvaluoResponseDto> dtos = pendientes.stream()
                    .map(AvaluoResponseDto::new)
                    .collect(Collectors.toList());

            return apiResponse.responseSuccess("Avalúos pendientes encontrados", dtos);
        } catch (Exception e) {
            return apiResponse.responseDataError("Error al buscar pendientes", e.getMessage());
        }
    }


}