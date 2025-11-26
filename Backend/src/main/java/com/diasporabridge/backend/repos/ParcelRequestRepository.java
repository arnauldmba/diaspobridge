package com.diasporabridge.backend.repos;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diasporabridge.backend.entities.ParcelRequest;
import com.diasporabridge.backend.entities.ParcelRequest.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ParcelRequestRepository extends JpaRepository<ParcelRequest, Long> {

    // Liste paginée des demandes d’un expéditeur
    Page<ParcelRequest> findBySender_IdOrderByCreatedAtDesc(Long senderId, Pageable pageable);

    // Filtrer par statut (utile pour back-office)
    Page<ParcelRequest> findByStatus(Status status, Pageable pageable);

    // Routes typiques (ville -> ville)
    Page<ParcelRequest> findByOriginCityIgnoreCaseAndDestCityIgnoreCase(
            String originCity, String destCity, Pageable pageable);

    // Fenêtre de date souhaitée (ex: “autour” d’une date)
    Page<ParcelRequest> findByDesiredDateBetween(LocalDate from, LocalDate to, Pageable pageable);

    // Vérifier qu’une demande appartient au user (pour autorisations)
    boolean existsByIdAndSender_Id(Long id, Long senderId);

    // Stats rapides
    long countByStatus(Status status);

    // Variante non paginée si besoin
    List<ParcelRequest> findTop20BySender_IdOrderByCreatedAtDesc(Long senderId);

    // Supprimer en s’assurant de l’appartenance
    long deleteByIdAndSender_Id(Long id, Long senderId);
}