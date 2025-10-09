package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Servicio;
import com.tucasa.backend.model.enums.TipoInmueble;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    // Jpa ya incluye funciones base (findAll, findById, etc.)
    // Ademas puede generar funciones/consultas si sigues un formato, por ejemplo

    @Query(value = "SELECT * FROM servicios s WHERE s.activo = true", nativeQuery = true)
    List<Servicio> findActivos();
}
