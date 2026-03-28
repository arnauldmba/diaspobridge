package DTO;

import java.time.Instant;

public record AdminUserRowDTO(
    Long id,
    String email,
    String firstName,
    String lastName,
    String role,
    boolean isBlocked,
    Boolean isActive,
    Boolean emailVerified,
    Instant deletedAt,
    Instant createdAt
){}
