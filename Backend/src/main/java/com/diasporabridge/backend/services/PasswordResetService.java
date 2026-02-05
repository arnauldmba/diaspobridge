package com.diasporabridge.backend.services;


import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.diasporabridge.backend.entities.PasswordResetToken;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.PasswordResetTokenRepository;
import com.diasporabridge.backend.repos.UsersRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UsersRepository usersRepository;
    private final PasswordResetTokenRepository tokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final SimpleMailService mailService;

    // URL du frontend (prod ou dev) pour construire le lien
    @Value("${app.frontend.base-url:http://localhost:4200}")
    private String frontendBaseUrl;

    // Durée de validité token (30 min)
    private static final Duration TOKEN_TTL = Duration.ofMinutes(30);

    public void requestReset(String email) {
        if (email == null || email.trim().isEmpty()) return;

        usersRepository.findActiveByEmailIgnoreCase(email.trim())
            .ifPresent(this::createAndSendToken);

        // IMPORTANT: ne rien révéler (email existe ou non)
    }

    private void createAndSendToken(User user) {
        // un seul token actif par user (simple)
        tokenRepo.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(TOKEN_TTL);

        PasswordResetToken prt = PasswordResetToken.builder()
            .token(token)
            .user(user)
            .expiresAt(expiresAt)
            .build();

        tokenRepo.save(prt);

        String link = frontendBaseUrl + "/reset-password?token=" + token;
        mailService.sendPasswordResetEmail(user.getEmail(), link);
    }

    public void resetPassword(String token, String newPassword) {
        if (token == null || token.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password required");
        }
        if (newPassword.length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password too short (min 8)");
        }

        PasswordResetToken prt = tokenRepo.findByToken(token.trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token"));

        if (prt.getExpiresAt().isBefore(Instant.now())) {
            tokenRepo.delete(prt); // nettoyage
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token expired");
        }

        User user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        usersRepository.save(user);

        // token consommé
        tokenRepo.deleteByUser(user);
    }

    // Optionnel mais propre : nettoyage régulier des tokens expirés
    @Scheduled(cron = "0 */30 * * * *") // toutes les 30 minutes
    public void cleanupExpiredTokens() {
        tokenRepo.deleteByExpiresAtBefore(Instant.now());
    }
}

