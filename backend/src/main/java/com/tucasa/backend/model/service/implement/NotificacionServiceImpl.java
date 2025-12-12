package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.model.dto.NotificacionDTO;
import com.tucasa.backend.model.entity.Avaluo;
import com.tucasa.backend.model.service.interfaces.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificacionServiceImpl implements NotificacionService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public void notificarCambioEstado(Avaluo avaluo) {
        if (avaluo == null || avaluo.getUsuario() == null) {
            return; // No se puede notificar
        }

        Long clienteId = avaluo.getUsuario().getId();
        String nuevoEstado = avaluo.getTipoAvaluo().name(); 

        NotificacionDTO dto = new NotificacionDTO(
                avaluo.getId(),
                clienteId,
                "El estado de tu avalúo cambió a: " + nuevoEstado,
                nuevoEstado
        );

        messagingTemplate.convertAndSend(
                "/topic/notificaciones/" + clienteId,
                dto
        );
    }
}
