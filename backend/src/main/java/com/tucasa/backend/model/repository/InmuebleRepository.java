package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Inmueble;
import com.tucasa.backend.model.enums.TipoInmueble;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InmuebleRepository extends JpaRepository<Inmueble, Long> {
    // Jpa ya incluye funciones base (findAll, findById, etc.)
    // Ademas puede generar funciones/consultas si sigues un formato, por ejemplo

    List<Inmueble> findByTipo(TipoInmueble tipo);
}
