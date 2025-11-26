package com.diasporabridge.backend.entities;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "parcel_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ParcelRequest {

  public enum ItemType { DOCUMENT, PHONE, LAPTOP, CLOTHES, OTHER }
  public enum Status { REQUESTED, MATCHED, IN_TRANSIT, DELIVERED, CANCELLED }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "sender_id", nullable = false)
  private User sender;

  @Column(name = "item_title", nullable = false, length = 120)
  private String itemTitle;

  @Enumerated(EnumType.STRING)
  @Column(name = "item_type", nullable = false, length = 20)
  private ItemType itemType;

  @Column(name = "weight_kg", precision = 5, scale = 2)
  private BigDecimal weightKg;

  @Column(name = "origin_city", nullable = false, length = 120)
  private String originCity;

  @Column(name = "origin_country", nullable = false, length = 120)
  private String originCountry;

  @Column(name = "dest_city", nullable = false, length = 120)
  private String destCity;

  @Column(name = "dest_country", nullable = false, length = 120)
  private String destCountry;

  @Column(name = "desired_date")
  private LocalDate desiredDate;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  @Builder.Default
  private Status status = Status.REQUESTED;

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
