package com.diasporabridge.backend.admin.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record AdminTripRowDTO(Long id,
    String originCity,
    String originCountry,
    String destCity,
    String destCountry,
    LocalDate departDate,
    BigDecimal pricePerKg,
    BigDecimal maxWeightKg,
    boolean isHidden,
    Boolean isActive,
    String note,
    Long transporterId,
    String transporterEmail,
    String transporterFirstName,
    String transporterLastName,
    boolean transporterBlocked,
    Instant transporterDeletedAt,
    Instant createdAt
) {}