package com.diasporabridge.backend.repos;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.diasporabridge.backend.entities.TransporterTrip;
import com.diasporabridge.backend.entities.User;

public interface TransporterTripRepository extends JpaRepository<TransporterTrip, Long> {

    /**
     * 1️⃣ Récupérer tous les trips d’un transporteur donné
     *    (on suppose que tu passes un transporter actif)
     */
    Page<TransporterTrip> findByTransporter(User transporter, Pageable pageable);
    List <TransporterTrip> findByTransporter(User transporter);

    /**
     * 2️⃣ Rechercher les trips selon ville d’origine / destination
     *    → on filtre sur:
     *      - isActive = true (si demandé)
     *      - transporter non soft-deleted
     */
    @Query("""
        SELECT t FROM TransporterTrip t
        WHERE (:origin IS NULL OR LOWER(t.originCity) LIKE LOWER(CONCAT('%', :origin, '%')))
          AND (:dest   IS NULL OR LOWER(t.destCity)   LIKE LOWER(CONCAT('%', :dest,   '%')))
          AND (:fromDate IS NULL OR t.departDate >= :fromDate)
          AND (:toDate   IS NULL OR t.departDate <= :toDate)
          AND (:activeOnly = false OR t.isActive = true)
          AND t.transporter.deletedAt IS NULL
        ORDER BY t.departDate ASC
    """)
    Page<TransporterTrip> searchTrips(
            @Param("origin") String origin,
            @Param("dest") String dest,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("activeOnly") boolean activeOnly,
            Pageable pageable
    );

    /**
     * 3️⃣ Recherche par pays d’origine / destination
     *     + seulement trips actifs si activeOnly=true
     *     + transporter non soft-deleted
     */
    @Query("""
        SELECT t FROM TransporterTrip t
        WHERE (:origin IS NULL OR LOWER(t.originCountry) LIKE LOWER(CONCAT('%', :origin, '%')))
          AND (:dest   IS NULL OR LOWER(t.destCountry)   LIKE LOWER(CONCAT('%', :dest,   '%')))
          AND (:activeOnly = false OR t.isActive = true)
          AND t.transporter.deletedAt IS NULL
        ORDER BY t.departDate ASC
    """)
    Page<TransporterTrip> searchTripsByCountry(
            @Param("origin") String origin,
            @Param("dest") String dest,
            @Param("activeOnly") boolean activeOnly,
            Pageable pageable
    );

    /**
     * Tous les trips actifs ET dont le transporter n’est pas soft-deleted
     *     → pour ton getAllTransporterTrip() public
     */
    @Query("""
        SELECT t FROM TransporterTrip t
        WHERE t.isActive = true
          AND t.transporter.deletedAt IS NULL
        ORDER BY t.departDate ASC
    """)
    List<TransporterTrip> findAllVisibleTrips();

    /**
     * Lister les trips d’un transporteur actifs uniquement
     * (ici on suppose que transporter est déjà un user actif)
     */
    Page<TransporterTrip> findByTransporterAndIsActiveTrue(User transporter, Pageable pageable);

    /**
     * 6️⃣ Trouver les trips par date exacte
     *     (on pourrait aussi filtrer sur transporter.deletedAt IS NULL si besoin)
     */
    List<TransporterTrip> findByDepartDate(LocalDate date);

    /**
     * 7️⃣ Trips d’un transporteur sur une période
     */
    @Query("""
        SELECT t FROM TransporterTrip t
        WHERE t.transporter = :transporter
          AND t.departDate BETWEEN :from AND :to
          AND t.isActive = true
        ORDER BY t.departDate ASC
    """)
    List<TransporterTrip> findByTransporterAndPeriod(
            @Param("transporter") User transporter,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );
    
    /** * 3️⃣ Trouver tous les trips actifs (pour affichage global) */ 
    Page<TransporterTrip> findByIsActiveTrue(Pageable pageable);
}
