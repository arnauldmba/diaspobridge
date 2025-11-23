package com.diasporabridge.backend.entities;


import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "match_id", nullable = false)
  private Match match;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "sender_id", nullable = false)
  private User sender;

  @Lob
  @Column(nullable = false)
  private String body;

  @Column(name = "sent_at", nullable = false, updatable = false)
  private Instant sentAt;

  @PrePersist
  void onCreate() {
    this.sentAt = Instant.now();
  }
}

