package com.diasporabridge.backend.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.Message;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.MatchRepository;
import com.diasporabridge.backend.repos.MessageRepository;
import com.diasporabridge.backend.repos.ParcelRequestRepository;
import com.diasporabridge.backend.repos.TransporterTripRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatServiceImpl implements ChatService{

	private final MatchRepository matchRepo;
	private final MessageRepository messageRepo;
	private final ParcelRequestRepository parcelRepo;
	private final TransporterTripRepository tripRepo;

	public Match openChat(Long tripId, User currentUser) {
		var trip = tripRepo.findById(tripId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

		// Empêcher de se chatter soi-même si tu veux
		if (trip.getTransporter().getId().equals(currentUser.getId())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot chat with yourself");
		}

		return matchRepo.findByTripIdAndRequesterId(tripId, currentUser.getId())
				.orElseGet(() -> matchRepo.save(
						Match.builder()
						.trip(trip)
						.requester(currentUser)
						.proposedBy(Match.ProposedBy.SENDER)
						.status(Match.MatchStatus.PENDING)
						.build()
						));
	}

	public void attachParcel(Long matchId, Long parcelId, User currentUser) {
		var match = matchRepo.findById(matchId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

		// Seuls requester ou transporter ont accès (même règle que chat)
		var transporterId = match.getTrip().getTransporter().getId();
		if (!currentUser.getId().equals(match.getRequester().getId()) && !currentUser.getId().equals(transporterId)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No access");
		}

		var parcel = parcelRepo.findById(parcelId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parcel not found"));

		// Le parcel doit appartenir au requester
		if (!parcel.getSender().getId().equals(match.getRequester().getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Parcel is not owned by requester");
		}

		match.setParcel(parcel);
		// save inutile si JPA flush, mais ok:
		matchRepo.save(match);
	}

	

}
