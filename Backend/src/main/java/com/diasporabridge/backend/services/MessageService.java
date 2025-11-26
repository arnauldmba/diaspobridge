package com.diasporabridge.backend.services;

import com.diasporabridge.backend.entities.Message;
import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.MatchRepository;
import com.diasporabridge.backend.repos.MessageRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MessageService {

    private final MessageRepository messageRepo;
    private final MatchRepository matchRepo;

    public MessageService(MessageRepository messageRepo, MatchRepository matchRepo) {
        this.messageRepo = messageRepo;
        this.matchRepo = matchRepo;
    }

    /**
     * 🔹 Envoyer un message dans un match existant
     */
    public Message sendMessage(Long matchId, String body, User sender) {
        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new EntityNotFoundException("Match not found"));

        // Optionnel : vérifier que le sender participe à ce match
        boolean authorized = match.getParcel().getSender().getId().equals(sender.getId())
                || match.getTrip().getTransporter().getId().equals(sender.getId());
        if (!authorized) throw new SecurityException("User not authorized for this match");

        Message msg = Message.builder()
                .match(match)
                .sender(sender)
                .body(body)
                .build();

        return messageRepo.save(msg);
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

    /**
     * 🔹 Supprimer un message envoyé par soi-même
     */
    public void deleteMessage(Long id, User requester) {
        Message msg = messageRepo.findByIdAndSender(id, requester);
        if (msg == null) throw new EntityNotFoundException("Message not found or not owned");
        messageRepo.delete(msg);
    }
}

