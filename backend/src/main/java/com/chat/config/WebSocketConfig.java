package com.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocketConfig - Groupe 9 : Spring Boot + WebSocket
 * Communication bidirectionnelle en temps réel (full-duplex).
 *
 * Sujet : "Éléments clés : WebSocketConfig, SimpMessagingTemplate, STOMP, SockJS"
 * "Utiliser Spring avec STOMP : @EnableWebSocket, @MessageMapping, SimpMessagingTemplate"
 *
 * - @EnableWebSocketMessageBroker : équivalent Spring de @EnableWebSocket pour STOMP (active WebSocket + broker de messages).
 * - registerStompEndpoints : point d'entrée pour les clients ; SockJS permet la connexion (fallback si WebSocket pur bloqué).
 * - configureMessageBroker : préfixes /app (messages vers le serveur) et /topic (messages diffusés aux clients).
 * - STOMP : protocole de messagerie sur WebSocket (souscription aux topics, envoi ciblé).
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Point de connexion pour les clients (SockJS)
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
    }
}