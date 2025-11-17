package com.tucasa.backend.model.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tucasa.backend.model.entity.Agente;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.TipoUsuario;
import com.tucasa.backend.model.repository.AgenteRepository;
import com.tucasa.backend.model.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class AgenteService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AgenteRepository agenteRepository;

    @Transactional
    public Agente convertirEnAgente(Long usuarioId, String descripcion, String experiencia, String matricula) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getRol() == TipoUsuario.AGENTE_INMOBILIARIO) {
            throw new RuntimeException("El usuario ya es agente inmobiliario");
        }

        Agente agente = new Agente();
        agente.setUsuario(usuario);
        agente.setDescripcion(descripcion);
        agente.setExperiencia(experiencia);
        agente.setMatricula(matricula);
        agente.setVerificado(false);

        usuario.setRol(TipoUsuario.AGENTE_INMOBILIARIO);
        usuarioRepository.save(usuario);

        return agenteRepository.save(agente);
    }
}
