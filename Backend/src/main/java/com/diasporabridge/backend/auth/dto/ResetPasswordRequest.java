package com.diasporabridge.backend.auth.dto;

public record ResetPasswordRequest(String token, String newPassword) {}
