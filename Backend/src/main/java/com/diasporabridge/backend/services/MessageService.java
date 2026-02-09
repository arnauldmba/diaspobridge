package com.diasporabridge.backend.services;

import com.diasporabridge.backend.entities.Message;
import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.MatchRepository;
import com.diasporabridge.backend.repos.MessageRepository;
import com.diasporabridge.backend.repos.ParcelRequestRepository;
import com.diasporabridge.backend.repos.TransporterTripRepository;

import DTO.MessageDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final MessageRepository messageRepo;
    private final MatchRepository matchRepo;
    private final MatchService matchService;
    private final ParcelRequestRepository parcelRepo;
    private final TransporterTripRepository tripRepo;
    //private final MatchServiceRepository matchServiceRepository;

    /**
     * 🔹 Envoyer un message dans un match existant
     */
    public Message sendMessage(Long matchId, String body, User sender) {
        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new EntityNotFoundException("Match not found"));

     // ✅ autorisation : participants du match
        boolean authorized =
            match.getRequester().getId().equals(sender.getId())
            || match.getTrip().getTransporter().getId().equals(sender.getId());

        if (!authorized) {
            throw new SecurityException("User not authorized for this match");
        }

        Message msg = Message.builder()
                .match(match)
                .sender(sender)
                .body(body)
                .build();
        
        Message saved = messageRepo.save(msg);
        
     // ✅ mettre à jour le match pour l'inbox (propre + performant)
        Instant now = saved.getSentAt(); // rempli par @PrePersist
        match.setLastMessagePreview(preview(saved.getBody()));
        match.setLastMessageAt(now);
        match.setUpdatedAt(now);

        matchRepo.save(match);

        return saved;
    }

    /**
     * 🔹 Récupérer les messages d’un match (conversation)
     */
    @Transactional(readOnly = true)
    public Page<Message> getMessagesForMatch(Long matchId, Pageable pageable, User requester) {
        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new EntityNotFoundException("Match not found"));

        // Vérifie que le user participe à cette conversation
        boolean authorized = match.getParcel().getSender().getId().equals(requester.getId())
                || match.getTrip().getTransporter().getId().equals(requester.getId());
        if (!authorized) throw new SecurityException("User not authorized for this match");

        return messageRepo.findByMatchOrderBySentAtAsc(match, pageable);
    }
    
    @Transactional
    public MessageDto send(Long matchId, String body, User me) {

      Match match = matchRepo.findById(matchId)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

      matchService.ensureParticipant(match, me.getId());

      Message saved = messageRepo.save(Message.builder()
          .match(match)
          .sender(me)
          .body(body.trim())
          .build());

      Instant now = saved.getSentAt();
      match.setLastMessagePreview(preview(saved.getBody()));
      match.setLastMessageAt(now);
      match.setUpdatedAt(now);

      // pas forcément besoin de save(match) si match est managed, mais ok de le laisser
      matchRepo.save(match);

      return new MessageDto(saved.getId(), matchId, me.getId(), saved.getBody(), saved.getSentAt());
    }

    /**
     * 🔹 Supprimer un message envoyé par soi-même
     */
    public void deleteMessage(Long id, User requester) {
        Message msg = messageRepo.findByIdAndSender(id, requester);
        if (msg == null) throw new EntityNotFoundException("Message not found or not owned");
        messageRepo.delete(msg);
    }
    
    private String preview2(String body) {
    	if (body == null) return null;
    	String b = body.trim();
    	if (b.length() <= 120) return b;
    	return b.substring(0, 120);
    }
    
    private String preview(String body) {
        if (body == null) return null;
        String b = body.trim();
        if (b.isEmpty()) return null;
        return b.length() <= 120 ? b : b.substring(0, 120);
      }
}

