package DTO;

public record ResetPasswordRequest(String token, String newPassword) {}
