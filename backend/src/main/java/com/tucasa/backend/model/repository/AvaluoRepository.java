package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Avaluo;
import com.tucasa.backend.model.enums.TipoAvaluo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;



@Repository
public interface AvaluoRepository extends JpaRepository<Avaluo, Long> {

    List<Avaluo> findByTipoAvaluo(TipoAvaluo tipoAvaluo);
    List<Avaluo> findByUsuarioId(Long usuarioId);
    
    List<Avaluo> findAll();

  
    List<Avaluo> findByAgente_Id(Long idAgente);
}