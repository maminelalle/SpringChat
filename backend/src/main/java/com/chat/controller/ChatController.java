package com.chat.controller;

import com.chat.model.ChatMessage;
import com.chat.model.User;
import com.chat.repository.ChatMessageRepository;
import com.chat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * ChatController - Groupe 9 : Spring Boot + WebSocket
 * Sujet : "Éléments clés : ... @MessageMapping, SimpMessagingTemplate"
 * - @MessageMapping : réception des messages STOMP envoyés par le client (/app/chat.sendMessage, /app/chat.addUser).
 * - SimpMessagingTemplate : envoi des messages vers les clients (convertAndSend vers /topic/public ou /topic/room/{id}).
 */
@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        if (chatMessage.getTimestamp() == null) {
            chatMessage.setTimestamp(LocalDateTime.now());
        }
        if (chatMessage.getType() == null) {
            chatMessage.setType(ChatMessage.MessageType.CHAT);
        }
        // Sauvegarde BDD
        try {
            chatMessageRepository.save(chatMessage);
        } catch (Exception e) {
            System.err.println("Erreur sauvegarde message: " + e.getMessage());
        }

        // Routage dynamique
        Long roomId = chatMessage.getRoomId();
        
        // NOTE: roomId 1 est considéré comme public dans cette implémentation
        if (roomId == null || roomId == 1) {
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        } else {
            messagingTemplate.convertAndSend("/topic/room/" + roomId, chatMessage);
        }
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage, 
                        SimpMessageHeaderAccessor headerAccessor) {
        
        String username = chatMessage.getSender();
        
        if (username != null) {
            headerAccessor.getSessionAttributes().put("username", username);
            
            // Gestion Utilisateur BDD (Eviter doublons avec lock optimiste ou try/catch)
            try {
                // Synchronisation basique pour éviter les race conditions lors des double-clics
                synchronized(this) {
                    Optional<User> existingUser = userRepository.findByUsername(username);
                    User user;
                    if (existingUser.isPresent()) {
                        user = existingUser.get();
                        user.setStatus("online");
                    } else {
                        user = new User(username, null, "online");
                    }
                    userRepository.save(user);
                    System.out.println("User connected/updated: " + username);
                }
            } catch (Exception e) {
                // Si erreur (ex: contrainte unique), on ignore ou on logue juste
                System.err.println("Error saving user (duplicate?): " + e.getMessage());
            }
        }
        
        if (chatMessage != null) {
            chatMessage.setTimestamp(LocalDateTime.now());
        }

        messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }
}