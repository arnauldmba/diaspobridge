package com.diasporabridge.backend.controllers;

import java.security.Principal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.Message;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.MatchRepository;
import com.diasporabridge.backend.repos.MessageRepository;
import com.diasporabridge.backend.services.MatchService;
import com.diasporabridge.backend.services.MessageService;
import com.diasporabridge.backend.services.UserServiceImpl;

import DTO.MessageDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
	
    private final UserServiceImpl userServiceImpl;
	private final MatchRepository matchRepository;
	private final MessageRepository messageRepository;
	private final MatchService matchService;
	private final MessageService messageService;

	public record SendMessageRequest(String body) {}

	@GetMapping("/matches/{matchId}/messages")
	public List<MessageDto> list(@PathVariable Long matchId, Principal principal) {
		User me = userServiceImpl.currentUser(principal);

		Match match = matchRepository.findById(matchId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

		matchService.ensureParticipant(match, me.getId());

		return messageRepository.findByMatchIdOrderBySentAtAsc(matchId)
				.stream()
				.map(m -> new MessageDto(m.getId(), matchId, m.getSender().getId(), m.getBody(), m.getSentAt()))
				.toList();
	}
	
	//nouvelle methode pour la finale*******
	@GetMapping("/matches/{matchId}/messages/new")
	public List<MessageDto> getNewMessages(@PathVariable Long matchId,
	                                       @RequestParam Instant since,
	                                       Principal principal) {

	  User me = userServiceImpl.currentUser(principal);

	  Match match = matchRepository.findById(matchId)
	      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

	  matchService.ensureParticipant(match, me.getId());

	  return messageRepository.findNewMessages(matchId, since).stream()
	      .map(m -> new MessageDto(
	          m.getId(),
	          m.getMatch().getId(),
	          m.getSender().getId(),
	          m.getBody(),
	          m.getSentAt()
	      ))
	      .toList();
	}
	
	@PostMapping("/matches/{matchId}/messages")
	public ResponseEntity<MessageDto> send(@PathVariable Long matchId,
	                                       @RequestBody SendMessageRequest req,
	                                       Principal principal) {
	  User me = userServiceImpl.currentUser(principal);

	  if (req.body() == null || req.body().trim().isEmpty()) {
	    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message empty");
	  }

	  MessageDto dto = messageService.send(matchId, req.body(), me);
	  return ResponseEntity.status(HttpStatus.CREATED).body(dto);
	}
}

