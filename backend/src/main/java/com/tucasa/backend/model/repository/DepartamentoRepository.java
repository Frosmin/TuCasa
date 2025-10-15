package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Departamento;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {
    // Jpa ya incluye funciones base (findAll, findById, etc.)

}