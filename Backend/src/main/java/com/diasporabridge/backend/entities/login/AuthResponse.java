package com.diasporabridge.backend.entities.login;

public record AuthResponse(String token, Long userId, String role) {}
