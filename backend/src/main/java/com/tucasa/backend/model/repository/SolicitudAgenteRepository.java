package com.tucasa.backend.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tucasa.backend.model.entity.SolicitudAgente;
import com.tucasa.backend.model.enums.EstadoSolicitud;

@Repository
public interface SolicitudAgenteRepository extends JpaRepository<SolicitudAgente, Long> {
    
    boolean existsByUsuarioId(Long usuarioId);
    
    List<SolicitudAgente> findByEstado(EstadoSolicitud estado);

    @Transactional
    Long deleteByUsuarioId(Long usuarioId);
}
