package com.chat.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
public class VoiceController {

    private final Path voiceDir;

    public VoiceController() throws IOException {
        String base = System.getProperty("java.io.tmpdir");
        this.voiceDir = Paths.get(base, "springchat-voice").toAbsolutePath();
        Files.createDirectories(voiceDir);
    }

    @PostMapping("/api/upload/voice")
    public Map<String, String> uploadVoice(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Fichier vocal vide");
        }
        String id = UUID.randomUUID().toString();
        String ext = "webm";
        String contentType = file.getContentType();
        if (contentType != null && contentType.contains("ogg")) ext = "ogg";
        Path dest = voiceDir.resolve(id + "." + ext);
        file.transferTo(dest.toFile());
        Map<String, String> result = new HashMap<>();
        result.put("id", id);
        result.put("ext", ext);
        return result;
    }

    @GetMapping("/api/voice/{id}")
    public ResponseEntity<Resource> getVoice(@PathVariable String id) throws IOException {
        Path pathWebm = voiceDir.resolve(id + ".webm");
        Path pathOgg = voiceDir.resolve(id + ".ogg");
        Path path = Files.exists(pathWebm) ? pathWebm : (Files.exists(pathOgg) ? pathOgg : null);
        if (path == null || !Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }
        Resource resource = new FileSystemResource(path);
        String contentType = path.toString().endsWith(".ogg") ? "audio/ogg" : "audio/webm";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + path.getFileName().toString() + "\"")
                .body(resource);
    }
}
