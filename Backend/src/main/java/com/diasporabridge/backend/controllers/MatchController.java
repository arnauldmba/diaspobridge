package com.diasporabridge.backend.controllers;

import java.security.Principal;
import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.diasporabridge.backend.user.entity.User;
import com.diasporabridge.backend.user.service.UserServiceImpl;
import com.diasporabridge.backend.match.dto.MatchDto;
import com.diasporabridge.backend.match.entity.Match;
import com.diasporabridge.backend.match.repo.MatchRepository;
import com.diasporabridge.backend.match.service.MatchService;
import com.diasporabridge.backend.message.repo.MessageRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/")
@RequiredArgsConstructor
public class MatchController {
	
	private final MatchRepository matchRepository;
    private final UserServiceImpl userServiceImpl;
    private final MatchService matchService;
    private final MessageRepository messageRepository;
   
    // => create-or-get match
    // => front route vers /chat/{matchId}
    @PostMapping("/trip/{tripId}/matches")
    public MatchDto contact(@PathVariable Long tripId, Principal principal) {
        User me = userServiceImpl.currentUser(principal);
        Match match = matchService.createOrGetMatch(tripId, me);
        return matchService.toDto(match, me) ;
    }
   
    
    @GetMapping("/matches/my")
    public List<MatchDto> myMatches(Principal principal) {
    User me = userServiceImpl.currentUser(principal);

    return matchRepository.findMyMatches(me.getId()).stream().map(match -> {
            Instant lastReadAt = matchService.lastReadAtFor(match, me.getId());
            long unread = messageRepository.countUnreadForUser(match.getId(), me.getId(), lastReadAt);

            return matchService.toDto(match, me, unread);
        }).toList();
    }
    
    // ✅ Détails match
    @GetMapping("/matches/{matchId}")
    public MatchDto get(@PathVariable Long matchId, Principal principal) {
        User me = userServiceImpl.currentUser(principal);

        Match match = matchRepository.findById(matchId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

        matchService.ensureParticipant(match, me.getId());

        return matchService.toDto(match, me);
    }
    
    private void ensureParticipant(Match match, User me) {
        Long meId = me.getId();
        Long requesterId = match.getRequester().getId();
        Long transporterId = match.getTrip().getTransporter().getId();

        if (!meId.equals(requesterId) && !meId.equals(transporterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }
    }
}
