package com.diasporabridge.backend;


import static org.assertj.core.api.Assertions.*;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.UsersRepository;

@DataJpaTest
public class UsersRepositoryTest {
	
	@Autowired UsersRepository repo; 
	
	private User baseUser(String email) {
		return User.builder()
				.email(email)
				.passwordHash("hast")
				.role(User.Role.SENDER)
				.firstName("John")
				.lastName("Doe")
				.phone("0123")
				.build();
	}
	
	
	@Test
	void create_setsDefaultsAndTimestamps() {
	    User u = repo.save(baseUser("u_"+UUID.randomUUID()+"@mail.com"));
	
	    assertThat(u.getId()).isNotNull();
	    assertThat(u.getIsActive()).isTrue();
	    assertThat(u.getEmailVerified()).isTrue();
	    assertThat(u.getCreatedAt()).isNotNull();
	    assertThat(u.getUpdatedAt()).isNotNull();
	    assertThat(u.getCreatedAt()).isEqualTo(u.getUpdatedAt());
	    
   }
	
	
	@Test
	  void uniqueEmail_throwsOnDuplicate_caseInsensitive() {
	    String email = "dup_"+UUID.randomUUID()+"@mail.com";
	    repo.save(baseUser(email));

	    // même email en MAJUSCULE
	    User dup = baseUser(email.toUpperCase());

	    assertThatThrownBy(() -> repo.saveAndFlush(dup))
	        .isInstanceOf(DataIntegrityViolationException.class);
	  }
	
	
	@Test
	  void findByEmailIgnoreCase_excludesSoftDeleted() {
	    String email = "x_"+UUID.randomUUID()+"@mail.com";
	    User u = repo.save(baseUser(email));

	    Optional<User> found = repo.findByEmailIgnoreCaseAndDeletedAtIsNull(email.toUpperCase());
	    assertThat(found).isPresent();

	    // soft delete
	    repo.softDeleteById(u.getId());

	    Optional<User> afterDelete = repo.findByEmailIgnoreCaseAndDeletedAtIsNull(email);
	    assertThat(afterDelete).isEmpty();

	    boolean exists = repo.existsByEmailIgnoreCaseAndDeletedAtIsNull(email);
	    assertThat(exists).isFalse();
	  }
	
	
	@Test
	  void deleteEntity_triggersSqlDelete() {
	    User u = repo.save(baseUser("del_"+UUID.randomUUID()+"@mail.com"));
	    repo.delete(u); // devrait utiliser @SQLDelete -> set deleted_at

	    // Tous les finders filtrés ne doivent plus le voir
	    assertThat(repo.findByIdAndDeletedAtIsNull(u.getId())).isEmpty();
	  }
	
	
	@Test
	  void paging_and_role_filters_onlyActiveNonDeleted() {
	    // actifs
	    User u1 = repo.save(baseUser("a1_"+UUID.randomUUID()+"@mail.com"));
	    User u2 = repo.save(baseUser("a2_"+UUID.randomUUID()+"@mail.com"));

	    // inactif
	    User inactif = baseUser("i_"+UUID.randomUUID()+"@mail.com");
	    inactif.setIsActive(false);
	    repo.save(inactif);

	    Page<User> page = repo.findByIsActiveTrueAndDeletedAtIsNull(PageRequest.of(0, 10));
	    assertThat(page.getContent()).extracting(User::getIsActive).containsOnly(true);

	    // rôle
	    u1.setRole(User.Role.TRANSPORTER);
	    repo.save(u1);

	    Page<User> transporters = repo.findByRoleAndIsActiveTrueAndDeletedAtIsNull(User.Role.TRANSPORTER, PageRequest.of(0, 10));
	    assertThat(transporters.getContent()).allMatch(u -> u.getRole() == User.Role.TRANSPORTER && u.getIsActive());
	  }
	
	@Test
	  void findTop10_ordersByCreatedAtDesc_andExcludesDeleted() {
	    for (int i=0; i<12; i++) repo.save(baseUser("t"+i+"_"+UUID.randomUUID()+"@mail.com"));
	    List<User> top10 = repo.findTop10ByDeletedAtIsNullOrderByCreatedAtDesc();
	    assertThat(top10).hasSize(10);
	    // ordre descendant
	    for (int i=1; i<top10.size(); i++) {
	      assertThat(top10.get(i-1).getCreatedAt()).isAfterOrEqualTo(top10.get(i).getCreatedAt());
	    }
	  }

}
