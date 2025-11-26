package com.diasporabridge.backend.controllers;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diasporabridge.backend.entities.Message;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.services.MessageService;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/{matchId}")
    public ResponseEntity<Message> send(@PathVariable Long matchId,
                                        @RequestBody Map<String, String> body,
                                        @AuthenticationPrincipal User me) {
        String content = body.get("body");
        Message saved = messageService.sendMessage(matchId, content, me);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{matchId}")
    public Page<Message> list(@PathVariable Long matchId,
                              Pageable pageable,
                              @AuthenticationPrincipal User me) {
        return messageService.getMessagesForMatch(matchId, pageable, me);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User me) {
        messageService.deleteMessage(id, me);
        return ResponseEntity.noContent().build();
    }
}

