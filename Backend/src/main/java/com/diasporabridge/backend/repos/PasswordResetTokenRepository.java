package com.diasporabridge.backend.repos;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diasporabridge.backend.entities.PasswordResetToken;
import com.diasporabridge.backend.entities.User;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user);

    long deleteByExpiresAtBefore(Instant now);
}
