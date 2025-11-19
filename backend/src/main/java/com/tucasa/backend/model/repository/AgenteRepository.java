package com.tucasa.backend.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tucasa.backend.model.entity.Agente;

public interface AgenteRepository extends JpaRepository<Agente, Long> {
}
