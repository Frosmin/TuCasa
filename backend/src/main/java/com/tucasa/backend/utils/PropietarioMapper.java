package com.tucasa.backend.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class PropietarioMapper {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario getPropietarioEntity(Long idPropietario){
        if (idPropietario == null) {
            throw new IllegalArgumentException("El ID del propietario no puede ser nulo");
        }
        return usuarioRepository.findById(idPropietario)
            .orElseThrow(() -> new EntityNotFoundException("Propietario no encontrado " + idPropietario));
    }
}
