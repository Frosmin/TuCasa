package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Oferta;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, Long> {
    // Jpa ya incluye funciones base (findAll, findById, etc.)
    @EntityGraph(attributePaths = {"inmueble", "inmueble.servicios"})
    @Query("SELECT o FROM Oferta o")
    List<Oferta> findAllCompleto();

    @EntityGraph(attributePaths = {"inmueble", "inmueble.servicios"})
    @Query("SELECT o FROM Oferta o WHERE o.id = :id")
    Optional<Oferta> findCompletoById(@Param("id") Long id);

    @EntityGraph(attributePaths = {"inmueble", "inmueble.servicios"})
    @Query("SELECT o FROM Oferta o WHERE o.id IN :ids")
    List<Oferta> findAllCompletoByIds(@Param("ids") List<Long> ids);

    @Query(value = "SELECT AVG(o.precio) FROM ofertas o WHERE o.id IN :ids", nativeQuery = true)
    BigDecimal findAveragePrecioByIds(@Param("ids") List<Long> ids);
}
