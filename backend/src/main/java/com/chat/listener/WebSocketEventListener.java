package com.chat.listener;

import com.chat.model.ChatMessage;
import com.chat.model.User;
import com.chat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import java.util.Optional;

@Component
public class WebSocketEventListener {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            System.out.println("User Disconnected : " + username);

            // Créer le message de LEAVE
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setType(ChatMessage.MessageType.LEAVE);
            chatMessage.setSender(username);
            chatMessage.setRoomId(null); // Global leave or specific? For now global notification

            messagingTemplate.convertAndSend("/topic/public", chatMessage);

            // Mettre à jour le statut en BDD
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isPresent()) {
                User u = user.get();
                u.setStatus("offline");
                userRepository.save(u);
            }
        }
    }
}