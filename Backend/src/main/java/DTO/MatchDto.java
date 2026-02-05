package DTO;

import java.time.Instant;

public record MatchDto(
	Long id,
    Long tripId,
    Long requesterId,
    Long transporterId,
    String originCity,
    String destCity,
    String status,
    String proposedBy,
    String lastMessagePreview,
    Instant updatedAt,
    
    Long otherUserId,
    String otherFirstName,
    String otherLastName,
    String avatarUrl
) {}
