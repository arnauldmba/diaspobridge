package com.diasporabridge.backend.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.TransporterTrip;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.MatchRepository;
import com.diasporabridge.backend.repos.TransporterTripRepository;
import com.diasporabridge.backend.repos.UsersRepository;
import com.diasporabridge.backend.services.MatchService;
import com.diasporabridge.backend.services.UserServiceImpl;

import DTO.MatchDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/")
@RequiredArgsConstructor
public class MatchController {
	
	private final MatchRepository matchRepository;
    private final UserServiceImpl userServiceImpl;
    private final MatchService matchService;
   
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
    	
    	return matchRepository.findMyMatches(me.getId())
    			.stream().map(m -> matchService.toDto(m, me)).toList();
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
