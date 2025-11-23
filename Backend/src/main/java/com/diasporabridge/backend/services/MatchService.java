package com.diasporabridge.backend.services;


import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.Match.MatchStatus;
import com.diasporabridge.backend.repos.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MatchService {

	 private final MatchRepository matchRepository;
	
	 public Match createMatch(Match match) {
	     // Vérifie si ce match existe déjà
	     if(matchRepository.existsByParcel_IdAndTrip_Id(match.getParcel().getId(), 
	    		 match.getTrip().getId())) {
	         throw new IllegalStateException("Match already exists for this parcel and trip.");
	     }
	     
	     return matchRepository.save(match);
	 }

 public Optional<Match> getMatch(Long id) {
     return matchRepository.findById(id);
 }

 public Page<Match> getMatchesForSender(Long senderId, Pageable pageable) {
     return matchRepository.findByParcel_Sender_IdOrderByCreatedAtDesc(senderId, pageable);
    		 
 }

 public Page<Match> getMatchesForTransporter(Long transporterId, Pageable pageable) {
     return matchRepository.findByTrip_Transporter_IdOrderByCreatedAtDesc(transporterId, pageable);    		 
 }

 public Match updateStatus(Long matchId, MatchStatus status) {
     Match m = matchRepository.findById(matchId)
             .orElseThrow(() -> new RuntimeException("Match not found"));
     m.setStatus(status);
     return matchRepository.save(m);
 }
}
