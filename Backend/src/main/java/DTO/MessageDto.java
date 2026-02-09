package DTO;

import java.time.Instant;

public record MessageDto(
		Long id,
		Long matchId,
		Long senderId,
		String body,
		Instant sentAt) {
}
