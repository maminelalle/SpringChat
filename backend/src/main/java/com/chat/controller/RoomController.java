package com.chat.controller;

import com.chat.model.ChatRoom;
import com.chat.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*") 
public class RoomController {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @GetMapping
    public List<ChatRoom> getAllRooms() {
        return chatRoomRepository.findAll();
    }

    /** Obtient ou crée une salle privée entre deux utilisateurs (ordre des noms normalisé). */
    @GetMapping("/private")
    public ResponseEntity<ChatRoom> getOrCreatePrivateRoom(
            @RequestParam String me,
            @RequestParam String with) {
        if (me == null || me.isBlank() || with == null || with.isBlank() || me.equals(with)) {
            return ResponseEntity.badRequest().build();
        }
        String[] sorted = new java.util.TreeSet<>(java.util.List.of(me.trim(), with.trim())).toArray(new String[0]);
        String roomName = "private_" + sorted[0] + "_" + sorted[1];
        return chatRoomRepository.findByNameAndType(roomName, "private")
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(chatRoomRepository.save(new ChatRoom(roomName, "private"))));
    }

    @PostMapping
    public ChatRoom createRoom(@RequestBody ChatRoom room) {
        if (room.getType() == null) {
            room.setType("public");
        }
        
        // Check if room with same name exists (very basic check)
        // Note: For a real app, we would add a method findByName in repository
        // Here we just iterate or rely on future constraints. 
        // Let's implement a quick check if it's a private room to avoid duplicates
        if ("private".equals(room.getType())) {
            // Find existing
            List<ChatRoom> all = chatRoomRepository.findAll();
            for (ChatRoom r : all) {
                if (r.getName().equals(room.getName()) && "private".equals(r.getType())) {
                    return r; // Return existing
                }
            }
        }

        return chatRoomRepository.save(room);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        return chatRoomRepository.findById(id)
                .map(room -> {
                    chatRoomRepository.delete(room);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}