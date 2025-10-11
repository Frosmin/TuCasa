package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Oferta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, Long> {
    // Jpa ya incluye funciones base (findAll, findById, etc.)
}
