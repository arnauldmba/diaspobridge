package com.diasporabridge.backend.services;


import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.Match.MatchStatus;
import com.diasporabridge.backend.entities.Message;
import com.diasporabridge.backend.entities.TransporterTrip;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.MatchRepository;
import com.diasporabridge.backend.repos.MessageRepository;
import com.diasporabridge.backend.repos.TransporterTripRepository;

import DTO.MatchDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final TransporterTripRepository tripRepository;
    private final MessageRepository messageRepository;

    @Transactional
    public Match createOrGetMatch(Long tripId, User requester) {
        TransporterTrip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        if (trip.getTransporter().getId().equals(requester.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot contact yourself");
        }

        return matchRepository.findByTripIdAndRequesterId(tripId, requester.getId())
            .orElseGet(() -> {
                Match m = Match.builder()
                    .trip(trip)
                    .requester(requester)
                    .parcel(null) 
                    .proposedBy(Match.ProposedBy.SENDER)
                    .status(Match.MatchStatus.PENDING)
                    .build();

                try {
                    return matchRepository.save(m);
                } catch (DataIntegrityViolationException e) {
                    // double click => match déjà créé
                    return matchRepository.findByTripIdAndRequesterId(tripId, requester.getId())
                        .orElseThrow(() -> e);
                }
            });
    }

    public void ensureParticipant(Match match, Long userId) {
        Long requesterId = match.getRequester().getId();
        Long transporterId = match.getTrip().getTransporter().getId();
        if (!userId.equals(requesterId) && !userId.equals(transporterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }
    }

    public MatchDto toDto(Match match, User me) {
        return toDto(match, me, 0L); // valeur par défaut
    }

    public MatchDto toDto(Match match, User me, long unreadCount) {
        var lastMsg = messageRepository.findTop1ByMatchIdOrderBySentAtDesc(match.getId())
            .map(Message::getBody)
            .map(b -> b.length() > 38 ? b.substring(0, 35) + "…" : b)
            .orElse(null);
        
        User requester = match.getRequester();
        User transporter = match.getTrip().getTransporter();
        
        // ✅ "other" = l'autre participant (selon moi)
        User other = me.getId().equals(requester.getId()) ? transporter : requester;
        
     // avatar (pas encore le champ, donc null)
        String avatarUrl = null; // other.getAvatarUrl();

        return new MatchDto(
            match.getId(),
            match.getTrip().getId(),
            requester.getId(),
            transporter.getId(),
            match.getTrip().getOriginCity(),
            match.getTrip().getDestCity(),
            match.getStatus().name(),
            match.getProposedBy().name(),
            lastMsg,
            match.getUpdatedAt(),
            unreadCount,

            other.getId(),
            other.getFirstName(),
            other.getLastName(),
            avatarUrl  
        );
    }
    
    List<Match> findMyMatches(@Param("userId") Long userId){
    	return matchRepository.findMyMatches(userId);
    }

    public Instant lastReadAtFor(Match match, Long meId) {
        if (match.getRequester().getId().equals(meId)) {
            return match.getRequesterLastReadAt();
        }

        if (match.getTrip().getTransporter().getId().equals(meId)) {
            return match.getTripOwnerLastReadAt();
        }

        throw new IllegalStateException("User " + meId + " is not participant of match " + match.getId());
    }   

    /* 
    @Transactional
    public void markRead(Long matchId, Long meId) {
    Match match = matchRepository.findById(matchId)
        .orElseThrow(() -> new RuntimeException("Match not found"));

    Instant now = Instant.now();

    if (match.getRequester().getId().equals(meId)) {
        match.setRequesterLastReadAt(now);
        } else if (match.getTrip().getTransporter().getId().equals(meId)) {
            match.setTripOwnerLastReadAt(now);
        } else {
            throw new RuntimeException("Not allowed");
        }
    }
    */

    @Transactional
    public void markRead(Long matchId, User me) {
    Match match = matchRepository.findById(matchId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

        ensureParticipant(match, me.getId());

        Instant now = Instant.now();

        if (match.getRequester().getId().equals(me.getId())) {
            match.setRequesterLastReadAt(now);
        } else if (match.getTrip().getTransporter().getId().equals(me.getId())) {
            match.setTripOwnerLastReadAt(now);
        }

        matchRepository.save(match);
    }
}
