package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    boolean existsByUsuarioIdAndOfertaId(Long usuarioId, Long ofertaId);
    Optional<Favorito> findByUsuarioIdAndOfertaId(Long usuarioId, Long ofertaId);
    List<Favorito> findByUsuarioId(Long usuarioId);
}