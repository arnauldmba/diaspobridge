package com.diasporabridge.backend.entities;

import java.time.Instant;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import jakarta.persistence.*;


import lombok.*;

@SQLDelete(sql = "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

	public enum Role { ADMIN, USER }

	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long id;

	  @Column(nullable = false, unique = true, length = 190)
	  private String email;

	  @Column(name = "password_hash", nullable = false, length = 255)
	  private String passwordHash;

	  @Enumerated(EnumType.STRING)
	  @Column(nullable = false, length = 20)
	  private Role role = Role.USER;

	  @Column(name = "first_name", length = 100)
	  private String firstName;

	  @Column(name = "last_name", length = 100)
	  private String lastName;

	  @Column(length = 40)
	  private String phone;
	  
	  // 🟢 Champs à ajouter :
	  @Builder.Default
	  @Column(name = "is_active", nullable = false)
	  private Boolean isActive = false;

	  @Builder.Default
	  @Column(name = "email_verified", nullable = false)
	  private Boolean emailVerified = false;
	  
	  @Column(name = "deleted_at")
	  private Instant deletedAt;

	  @Column(name = "created_at", nullable = false, updatable = false)
	  private Instant createdAt;

	  @Column(name = "updated_at", nullable = false)
	  private Instant updatedAt;

	  @PrePersist
	  void onCreate() {
	      // filet de sécurité si jamais le builder a mis null
	      if (isActive == null)       isActive = false;
	      if (emailVerified == null)  emailVerified = false; // ou false selon ta logique
	      this.createdAt = this.updatedAt = Instant.now();
	  }

	  @PreUpdate
	  void onUpdate() {
	    this.updatedAt = Instant.now();
	  }

	@Override
	public String toString() {
		return "User [id=" + id + ", email=" + email + ", passwordHash=" + passwordHash + ", role=" + role
				+ ", firstName=" + firstName + ", lastName=" + lastName + ", phone=" + phone + ", createdAt="
				+ createdAt + ", updatedAt=" + updatedAt + "]";
	}
	
}
