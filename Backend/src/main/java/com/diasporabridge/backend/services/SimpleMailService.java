package com.diasporabridge.backend.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SimpleMailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetLink) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("maloudalm15@gmail.com");
        msg.setTo(to);
        msg.setSubject("MbokoGo - Réinitialisation du mot de passe");
        msg.setText(
            "Bonjour,\n\n" +
            "Tu as demandé une réinitialisation de mot de passe.\n" +
            "Clique sur ce lien (valide 30 minutes) :\n" +
            resetLink + "\n\n" +
            "Si tu n'es pas à l'origine de cette demande, ignore ce message.\n\n" +
            "MbokoGo"
        );
        mailSender.send(msg);
    }
}

