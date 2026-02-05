package DTO;

import java.math.BigDecimal;

import com.diasporabridge.backend.entities.Match;

public record UpdateMatchRequest(BigDecimal priceEur, Match.MatchStatus status, Long parcelId) {}
