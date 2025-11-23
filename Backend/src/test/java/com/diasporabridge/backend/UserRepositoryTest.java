package com.diasporabridge.backend;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.UsersRepository;
import com.diasporabridge.backend.services.UserService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@SpringBootTest
public class UserRepositoryTest {

	@Autowired
	private UsersRepository usersRepository;
	
	@PersistenceContext EntityManager em;
	
	
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
	    User u = usersRepository.save(baseUser("u_"+UUID.randomUUID()+"@mail.com"));
	
	    assertThat(u.getId()).isNotNull();
	    assertThat(u.getIsActive()).isTrue();
	    assertThat(u.getEmailVerified()).isTrue();
	    assertThat(u.getCreatedAt()).isNotNull();
	    assertThat(u.getUpdatedAt()).isNotNull();
	    assertThat(u.getCreatedAt()).isEqualTo(u.getUpdatedAt());
   }
	
	@Test
	void findByEmailIgnoreCase_excludesSoftDeleted() {
	    String email = "x_"+UUID.randomUUID()+"@mail.com";
	    User u = usersRepository.save(baseUser(email));

	    Optional<User> found = usersRepository.findByEmailIgnoreCaseAndDeletedAtIsNull(email.toUpperCase());
	    assertThat(found).isPresent();

	    // soft delete
	    usersRepository.softDeleteById(u.getId());

	    Optional<User> afterDelete = usersRepository.findByEmailIgnoreCaseAndDeletedAtIsNull(email);
	    assertThat(afterDelete).isEmpty();

	    boolean exists = usersRepository.existsByEmailIgnoreCaseAndDeletedAtIsNull(email);
	    assertThat(exists).isFalse();
    }
	
	@Test
	public void testFindByIdAndDeletedAtIsNull() {
		
		Optional<User> optionalUser = usersRepository.findByIdAndDeletedAtIsNull(13L);
		
		if (optionalUser.isPresent()) {
			User user = optionalUser.get();
			System.out.println();
			System.out.println("User: "+ user.getLastName());
		} else {
			System.out.println("Leer");
			System.out.println();
		}
	}

	@Test
	public void testSoftDeleteById() {
	    User user = new User();
	    user.setEmail("test+" + UUID.randomUUID() + "@mail.com");
	    user.setPasswordHash("hash");
	    user.setFirstName("Test");
	    user.setLastName("User");
	    user.setPhone("+017612008068");
	    usersRepository.save(user);

	    int rows = usersRepository.softDeleteById(user.getId());
	    assertEquals(1, rows);

	    Optional<User> found = usersRepository.findByIdAndDeletedAtIsNull(user.getId());
	    assertTrue(found.isEmpty(), "L'utilisateur ne devrait plus être visible après soft delete");
	}
	
	@Test
	public void testDeleteUser() {
		usersRepository.deleteById(1L);
	}
	
	@Test
	public void testUpdateUser() {
		System.out.println();
	    System.out.println("-------");

	    Optional<User> optionalUser = usersRepository.findById(30L);
	    assertTrue(optionalUser.isPresent(), "❌ Aucun utilisateur trouvé avec l'id 30");

	    User user = optionalUser.get();
	    user.setFirstName("Arnauld");
	    User saved = usersRepository.save(user);

	    assertEquals("Arnauld", saved.getFirstName());
	    System.out.println("✅ User updated successfully");
	    System.out.println("-------");
	    System.out.println();
	}
	
	
	@Test
	public void testFindAllUser() {
		System.out.println();
		System.out.println("----------------------");
	    
	    List<User> users = usersRepository.findAll();	    

	    if (users.isEmpty()) {
	        System.out.println("⚠️ Aucun utilisateur trouvé dans la base.");
	    } else {
	        users.forEach(System.out::println);
	    }

	    System.out.println("----------------------");
	    System.out.println();
	}
	
	
	@Test
	public void testFindUserByEmail() {
		System.out.println();
		System.out.println("----------------------");
		
		Optional users = usersRepository.findByEmailIgnoreCaseAndDeletedAtIsNull("maldyzebo@mail.com");	
	
		if (users.isPresent()) {
		    User user = (User) users.get();
		    System.out.println("Nom: " + user.getFirstName());
		} else {
		    System.out.println("Aucun utilisateur trouvé");
		}
		
		System.out.println("----------------------");
		System.out.println();
	}
	
	@Test
	public void testIfUserExistsByEamilIgnoreCaseAndDeleteAtIsNullTru() {
		System.out.println();
		System.out.println("----------------------");
		
		User user = new User();
	    user.setEmail("damsoneufdeux@mail.com");
	    user.setPasswordHash("hash");
	    user.setFirstName("Damso");
	    user.setLastName("Neufdeux");
	    user.setRole(User.Role.SENDER);
	    usersRepository.save(user);
		
		Boolean exists = usersRepository.existsByEmailIgnoreCaseAndDeletedAtIsNull("damsoneufdeux@mail.com");
		
		assertTrue(exists, "L'utilisateur devrait exister dans la DB");
		System.out.println("✅ Test passed: l'utilisateur existe bien.");
		
		System.out.println("----------------------");
		System.out.println();
	}
	
	@Test
	public void testIfUserDoesNotExistByEmailIgnoreCaseAndDeletedAtIsNull() {
	    boolean exists = usersRepository.existsByEmailIgnoreCaseAndDeletedAtIsNull("inconnu@mail.com");
	    assertFalse(exists, "L'utilisateur ne devrait pas exister");
	}
	
	

}
