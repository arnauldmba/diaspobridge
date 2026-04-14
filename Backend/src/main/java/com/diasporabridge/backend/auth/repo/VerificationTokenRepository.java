package com.diasporabridge.backend.auth.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diasporabridge.backend.auth.entity.VerificationToken;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
	VerificationToken findByToken(String token);
	void deleteByUserId(Long userId);
	Optional<VerificationToken> findByUserId(Long userId);
}
