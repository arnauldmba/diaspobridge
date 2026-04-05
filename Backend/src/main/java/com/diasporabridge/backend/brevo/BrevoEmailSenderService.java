package com.diasporabridge.backend.brevo;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.diasporabridge.backend.util.EmailSender;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BrevoEmailSenderService implements EmailSender {

    private final RestClient brevoRestClient;

    @Value("${BREVO_API_KEY}")
    private String brevoApiKey;

    @Value("${APP_MAIL_FROM}")
    private String fromEmail;

    @Value("${APP_MAIL_FROM_NAME:MbokoGO}")
    private String fromName;

    @Override
    public void sendEmail(String toEmail, String subject, String body) {
        Map<String, Object> payload = Map.of(
                "sender", Map.of(
                        "name", fromName,
                        "email", fromEmail
                ),
                "to", List.of(
                        Map.of("email", toEmail)
                ),
                "subject", subject,
                "htmlContent", body
        );

        brevoRestClient.post()
                .uri("/smtp/email")
                .header("api-key", brevoApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity();
    }
}