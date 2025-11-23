package com.diasporabridge.backend.repos;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.diasporabridge.backend.entities.User;

import jakarta.transaction.Transactional;

public interface UsersRepository extends JpaRepository<User, Long> {
	
	// --- Uniques / existence ---
    Optional<User> findByEmailIgnoreCaseAndDeletedAtIsNull(String email);
    boolean existsByEmailIgnoreCaseAndDeletedAtIsNull(String email);

    Optional<User> findByIdAndDeletedAtIsNull(Long id);

    // --- Lists / filtres courants ---
    Page<User> findByIsActiveTrueAndDeletedAtIsNull(Pageable pageable);
    Page<User> findByRoleAndIsActiveTrueAndDeletedAtIsNull(User.Role role, Pageable pageable);

    // Recherche "annuaire" (nom/prénom)
    Page<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseAndDeletedAtIsNull(
        String firstNameLike, String lastNameLike, Pageable pageable
    );

    // Outils
    long countByRoleAndDeletedAtIsNull(User.Role role);
    List<User> findTop10ByDeletedAtIsNullOrderByCreatedAtDesc();
    List<User> findByIdInAndDeletedAtIsNull(Collection<Long> ids);

    // Optionnel : si tu veux VRAIMENT chercher par email partiel (admin only)
    Page<User> findByEmailContainingIgnoreCaseAndDeletedAtIsNull(String emailLike, Pageable pageable);

    // Exemple si tu veux garder une @Query explicite :
    // @Query("select u from User u where lower(u.firstName) = lower(?1) and u.deletedAt is null")
    // List<User> findByFirstNameExactIgnoreCase(String firstName);
    
    /**
     * Modifying indique qu’il s’agit d’une requête d’écriture (UPDATE).
     * @Query exécute une requête JPQL (pas SQL brut).
     * int → renvoie le nombre de lignes affectées (utile pour savoir si ça a marché).
     * @param id
     * @return
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.deletedAt = CURRENT_TIMESTAMP WHERE u.id = :id")
    int softDeleteById(@Param("id") Long id);
    
    @Query("""
    		  SELECT u FROM User u
    		  WHERE u.deletedAt IS NULL
    		    AND (LOWER(u.firstName) LIKE LOWER(CONCAT('%', :q, '%'))
    		         OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :q, '%')))
    		""")
	Page<User> searchDirectory(@Param("q") String q, Pageable pageable);
}
