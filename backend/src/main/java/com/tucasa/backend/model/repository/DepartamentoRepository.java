package com.tucasa.backend.model.repository;

import com.tucasa.backend.model.entity.Departamento;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {
    // Jpa ya incluye funciones base (findAll, findById, etc.)

    @Query(
        value = """
                SELECT d.id,d.num_dormitorios, d.num_banos, d.piso, d.superficie_interna,
                d.monto_expensas, d.mascotas_permitidas, d.parqueo, d.amoblado, d.ascensor, d.balcon,
                o.id AS oferta_id, o.precio, o.tipo_operacion, o.descripcion
                FROM departamentos d
                LEFT JOIN ofertas o ON o.id_inmueble = d.id 
                WHERE
                    (:op IS NULL OR o.tipo_operacion = :op)
                    AND (:mn IS NULL OR o.precio >= :mn)
                    AND (:mx IS NULL OR o.precio <= :mx)
                    AND (:smn IS NULL OR d.superficie_interna >= :smn)
                    AND (:smx IS NULL OR d.superficie_interna <= :smx)
                    AND (:nd IS NULL OR d.num_dormitorios = :nd)
                ORDER BY d.id;
                """,
        nativeQuery = true
    )
    public List<Map<String,Object>> filtrar2(
        @Param("op") String tipoOperacion,
        @Param("mn") BigDecimal precioMin,
        @Param("mx") BigDecimal precioMax,
        @Param("smn") BigDecimal superficieMin,
        @Param("smx") BigDecimal superficieMax,
        @Param("nd") Integer numDormitorios
    );
}