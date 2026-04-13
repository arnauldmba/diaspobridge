package com.diasporabridge.backend.services;

import org.springframework.stereotype.Service;

import com.diasporabridge.backend.common.email.EmailSender;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SimpleMailService {

    private final EmailSender emailSender;

    public void sendPasswordResetEmail(String to, String resetLink) {
        String body =
                "<p>Bonjour,</p>" +
                "<p>Tu as demandé une réinitialisation de mot de passe.</p>" +
                "<p>Clique sur ce lien (valide 30 minutes) :</p>" +
                "<p><a href=\"" + resetLink + "\">Réinitialiser mon mot de passe</a></p>" +
                "<p>Si tu n'es pas à l'origine de cette demande, ignore ce message.</p>" +
                "<p>MbokoGo</p>";

        emailSender.sendEmail(
                to,
                "MbokoGo - Réinitialisation du mot de passe",
                body
        );
    }
}

