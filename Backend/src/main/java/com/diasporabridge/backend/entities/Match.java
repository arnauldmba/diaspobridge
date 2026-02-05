package com.diasporabridge.backend.entities;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
		name = "matches",
		uniqueConstraints = @UniqueConstraint(
				name = "uq_trip_requester",
				columnNames = {"trip_id","requester_id"}
				)
		)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Match {

	//public enum ProposedBy { TRANSPORT, SYSTEM, SENDER }
	public enum ProposedBy { REQUESTER, TRIP_OWNER, SENDER }
	public enum MatchStatus { PENDING, ACCEPTED, REJECTED, CANCELLED }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// ✅ nouveau: celui qui contacte (le client)
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "requester_id", nullable = false)
	private User requester;

	// ✅ devient optionnel: tu peux chatter sans parcel
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parcel_id")
	private ParcelRequest parcel;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "trip_id", nullable = false)
	private TransporterTrip trip;

	@Enumerated(EnumType.STRING)
	@Column(name = "proposed_by", nullable = false, length = 20)
	private ProposedBy proposedBy;

	@Column(name = "price_eur", precision = 10, scale = 2)
	private BigDecimal priceEur;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	@Builder.Default
	private MatchStatus status = MatchStatus.PENDING;

	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;
	
	@Column(name = "last_message_preview", length = 120)
	private String lastMessagePreview;
	
	@Column(name = "last_message_at")
	private Instant lastMessageAt;

	@PrePersist
	void onCreate() { this.createdAt = this.updatedAt = Instant.now(); }

	@PreUpdate
	void onUpdate() { this.updatedAt = Instant.now(); }
}
