package com.diasporabridge.backend.register;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
	VerificationToken findByToken(String token);
	void deleteByUserId(Long userId);
	Optional<VerificationToken> findByUserId(Long userId);
}
