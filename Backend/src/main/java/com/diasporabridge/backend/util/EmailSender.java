package com.diasporabridge.backend.util;


public interface EmailSender {
	void sendEmail(String toEmail, String body);
}
