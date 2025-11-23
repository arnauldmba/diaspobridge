package com.diasporabridge.backend.repos;

import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.Match.MatchStatus;
import com.diasporabridge.backend.entities.Match.ProposedBy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    // 🔹 Trouver un match spécifique pour un couple (parcel, trip)
    Optional<Match> findByParcel_IdAndTrip_Id(Long parcelId, Long tripId);

    // 🔹 Vérifier si un match existe déjà entre un colis et un trajet
    boolean existsByParcel_IdAndTrip_Id(Long parcelId, Long tripId);

    // 🔹 Liste des matches proposés par un expéditeur
    Page<Match> findByParcel_Sender_IdOrderByCreatedAtDesc(Long senderId, Pageable pageable);

    // 🔹 Liste des matches pour un transporteur donné
    Page<Match> findByTrip_Transporter_IdOrderByCreatedAtDesc(Long transporterId, Pageable pageable);

    // 🔹 Matches par statut (pour filtrer par état)
    Page<Match> findByStatus(MatchStatus status, Pageable pageable);

    // 🔹 Matches en attente pour un transporteur spécifique
    @Query("SELECT m FROM Match m WHERE m.trip.transporter.id = :transporterId AND m.status = 'PENDING'")
    List<Match> findPendingForTransporter(Long transporterId);

    // 🔹 Matches en attente pour un sender spécifique
    @Query("SELECT m FROM Match m WHERE m.parcel.sender.id = :senderId AND m.status = 'PENDING'")
    List<Match> findPendingForSender(Long senderId);

    // 🔹 Trouver tous les matches (colis) déjà acceptés pour un trajet
    @Query("SELECT m FROM Match m WHERE m.trip.id = :tripId AND m.status = 'ACCEPTED'")
    List<Match> findAcceptedForTrip(Long tripId);

    // 🔹 Nombre de matches actifs d’un sender (pour statistiques)
    long countByParcel_Sender_IdAndStatus(Long senderId, MatchStatus status);

    // 🔹 Nombre de matches actifs d’un transporteur
    long countByTrip_Transporter_IdAndStatus(Long transporterId, MatchStatus status);
}

