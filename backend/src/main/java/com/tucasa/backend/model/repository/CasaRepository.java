package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Casa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CasaRepository extends JpaRepository<Casa, Long> {
    // Jpa ya incluye funciones base (findAll, findById, etc.)
    // Ademas puede generar funciones/consultas si sigues un formato, por ejemplo
}
