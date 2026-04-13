package com.diasporabridge.backend.repos;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.diasporabridge.backend.auth.entity.PasswordResetToken;
import com.diasporabridge.backend.user.entity.User;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user);

    @Modifying
    @Transactional
    int deleteByExpiresAtBefore(Instant now);
}
