package com.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Point de connexion pour les clients (SockJS)
        // setAllowedOriginPatterns("*") est crucial pour permettre l'accès depuis index.html local
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Préfixe pour les messages destinés au serveur (ex: /app/chat.sendMessage)
        registry.setApplicationDestinationPrefixes("/app");
        
        // Préfixe pour les messages diffusés aux clients (ex: /topic/public)
        registry.enableSimpleBroker("/topic");
    }
}