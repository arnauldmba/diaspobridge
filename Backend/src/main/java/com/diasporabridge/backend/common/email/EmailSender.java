package com.diasporabridge.backend.common.email;


public interface EmailSender {
	void sendEmail(String toEmail, String subject, String body);
}
