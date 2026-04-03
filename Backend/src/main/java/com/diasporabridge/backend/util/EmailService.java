package com.diasporabridge.backend.util;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class EmailService implements EmailSender {

	private final JavaMailSender mailSender;
	
	@Override
	public void sendEmail(String to, String email) {
		
		if (to == null || to.trim().isEmpty()) {
		    throw new IllegalArgumentException("Recipient email is missing");
		}
		
		SimpleMailMessage msg = new SimpleMailMessage();
		msg.setFrom("MbokoGO <noreply@mbokogo.com>");
		//msg.setFrom("noreply@mbokogo.com"); // ok pour test
		msg.setTo(to);
		msg.setSubject("MbokoGO - Confirmer votre email");
		msg.setText(email);
		
		mailSender.send(msg); 
	  }
	  
}
