package com.diasporabridge.backend.match.dto;

import java.math.BigDecimal;

import com.diasporabridge.backend.match.entity.Match;

public record UpdateMatchRequest(BigDecimal priceEur, Match.MatchStatus status, Long parcelId) {}
