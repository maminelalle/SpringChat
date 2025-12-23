package com.chat.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 2000)
    private String content;
    
    private String sender;
    
    @Enumerated(EnumType.STRING)
    private MessageType type;
    
    private LocalDateTime timestamp;
    
    private Long roomId;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    // Constructeurs
    public ChatMessage() {}

    public ChatMessage(Long id, String content, String sender, MessageType type, LocalDateTime timestamp, Long roomId) {
        this.id = id;
        this.content = content;
        this.sender = sender;
        this.type = type;
        this.timestamp = timestamp;
        this.roomId = roomId;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }
}