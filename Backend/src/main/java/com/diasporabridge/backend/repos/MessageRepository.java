package com.diasporabridge.backend.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.Message;
import com.diasporabridge.backend.entities.User;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {
	
	Page<Message> findByMatchIdOrderBySentAtDesc(Long id, PageRequest of);
	List<Message> findByMatchIdOrderBySentAtDesc(Long matchId);
	Optional<Message> findTop1ByMatchIdOrderBySentAtDesc(Long matchId);
	
	Page<Message> findByMatchIdOrderBySentAtAsc(Long id, Pageable pageable);
	List<Message> findByMatchIdOrderBySentAtAsc(Long id);
	
	@Query("""
			  SELECT m FROM Message m
			  WHERE m.match.id = :matchId
			    AND m.sentAt > :since
			  ORDER BY m.sentAt ASC
			""")
	List<Message> findNewMessages(@Param("matchId") Long matchId,
			@Param("since") Instant since);

    /**
     * 🔹 Trouver tous les messages d’un match, triés par date (du plus ancien au plus récent)
     */
    Page<Message> findByMatchOrderBySentAtAsc(Match match, Pageable pageable);

    /**
     * 🔹 Trouver les messages récents pour un match donné (utilisé dans la vue conversation)
     */
    @Query("SELECT m FROM Message m WHERE m.match = :match ORDER BY m.sentAt DESC")
    Page<Message> findRecentByMatch(@Param("match") Match match, Pageable pageable);

    /**
     * 🔹 Trouver tous les messages envoyés par un utilisateur (utile pour statistiques ou modération)
     */
    Page<Message> findBySender(User sender, Pageable pageable);

    /**
     * Trouver un message précis pour vérifier l’appartenance
     */
    @Query("SELECT m FROM Message m WHERE m.id = :id AND m.sender = :sender")
    Message findByIdAndSender(@Param("id") Long id, @Param("sender") User sender);

	Page<Message> findByMatchIdAndSenderIdOrderBySentAtDesc(Long id, Long id2, PageRequest of);

	Page<Message> findByMatchIdOrderBySentAtAsc(Long id, PageRequest of);
}