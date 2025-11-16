package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Inmueble;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.TipoInmueble;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InmuebleRepository extends JpaRepository<Inmueble, Long> {
    // Jpa ya incluye funciones base (findAll, findById, etc.)
    // Ademas puede generar funciones/consultas si sigues un formato, por ejemplo

    List<Inmueble> findByTipo(TipoInmueble tipo);

    @Query("SELECT i.propietario FROM Inmueble i WHERE i.id = :inmuebleId")
    Usuario findPropietarioByInmuebleId(@Param("inmuebleId") Long inmuebleId);
}
