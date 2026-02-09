package com.diasporabridge.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "transporter_trips")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TransporterTrip {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "transporter_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private User transporter;

  @Column(name = "origin_city", nullable = false, length = 120)
  private String originCity;
  
  @Column(name = "price_per_kg", nullable = false, precision = 8, scale = 2)
  private BigDecimal pricePerKg;

  @Column(name = "origin_country", nullable = false, length = 120)
  private String originCountry;

  @Column(name = "dest_city", nullable = false, length = 120)
  private String destCity;

  @Column(name = "dest_country", nullable = false, length = 120)
  private String destCountry;

  @Column(name = "depart_date", nullable = false)
  private LocalDate departDate;

  @Column(name = "max_weight_kg", precision = 5, scale = 2)
  private BigDecimal maxWeightKg;

  /**
   * Le schéma MySQL utilise un type SET.
   * Pour rester simple et compatible JPA, on stocke ici une liste CSV : "DOCUMENT,PHONE,LAPTOP"
   * (Tu peux plus tard passer à @ElementCollection si tu préfères une table jointe.)
   */
  @Column(name = "accepted_types", length = 100)
  private String acceptedTypes;

  @Column(name = "is_active", nullable = false)
  @Builder.Default
  private Boolean isActive = true;

  @Column(length = 500)
  private String note;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @PrePersist
  void onCreate() {
    this.createdAt = this.updatedAt = Instant.now();
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = Instant.now();
  }
}

