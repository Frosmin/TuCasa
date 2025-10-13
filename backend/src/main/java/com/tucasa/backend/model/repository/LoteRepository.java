package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Lote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoteRepository extends JpaRepository<Lote, Long> {
    
}
