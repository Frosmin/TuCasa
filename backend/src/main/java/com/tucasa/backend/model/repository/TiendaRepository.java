package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Casa;
import com.tucasa.backend.model.entity.Tienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TiendaRepository extends JpaRepository<Tienda, Long> {
    // Jpa ya incluye funciones base (findAll, findById, etc.)
}
