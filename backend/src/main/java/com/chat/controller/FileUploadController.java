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
public class FileUploadController {

    private final Path filesDir;
    private static final long MAX_SIZE = 10 * 1024 * 1024; // 10 Mo

    public FileUploadController() throws IOException {
        String base = System.getProperty("java.io.tmpdir");
        this.filesDir = Paths.get(base, "springchat-files").toAbsolutePath();
        Files.createDirectories(filesDir);
    }

    @PostMapping("/api/upload/file")
    public Map<String, String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Fichier vide");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("Fichier trop volumineux (max 10 Mo)");
        }
        String contentType = file.getContentType();
        if (contentType == null) contentType = "";
        String type;
        String ext;
        if (contentType.startsWith("image/")) {
            type = "image";
            ext = contentType.replace("image/", "").split(";")[0].trim();
            if (ext.isEmpty() || ext.length() > 4) ext = "png";
        } else if (contentType.equals("application/pdf")) {
            type = "pdf";
            ext = "pdf";
        } else {
            throw new IllegalArgumentException("Type non supporté. Utilisez une image ou un PDF.");
        }
        String id = UUID.randomUUID().toString();
        String safeName = file.getOriginalFilename() != null ? file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_") : "file";
        Path dest = filesDir.resolve(id + "." + ext);
        file.transferTo(dest.toFile());
        Path meta = filesDir.resolve(id + ".meta");
        Files.writeString(meta, safeName + "\n" + type + "\n" + ext);
        Map<String, String> result = new HashMap<>();
        result.put("id", id);
        result.put("type", type);
        result.put("originalName", safeName);
        return result;
    }

    @GetMapping("/api/files/{id}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String id,
            @RequestParam(required = false) Boolean download) throws IOException {
        if (id == null || id.contains("..") || id.contains("/") || id.contains("\\")) {
            return ResponseEntity.notFound().build();
        }
        Path meta = filesDir.resolve(id + ".meta");
        if (!Files.exists(meta)) {
            return ResponseEntity.notFound().build();
        }
        String[] lines = Files.readString(meta).split("\n");
        String originalName = lines.length > 0 ? lines[0].trim() : id;
        String typeStr = lines.length > 1 ? lines[1].trim() : "";
        String ext = lines.length > 2 ? lines[2].trim() : "";
        Path path = filesDir.resolve(id + "." + ext);
        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }
        String contentType = "application/octet-stream";
        if ("image".equals(typeStr)) {
            contentType = "image/" + (ext.equals("jpg") ? "jpeg" : ext);
        } else if ("pdf".equals(typeStr)) {
            contentType = "application/pdf";
        }
        Resource resource = new FileSystemResource(path);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        boolean asAttachment = Boolean.TRUE.equals(download);
        headers.setContentDispositionFormData(asAttachment ? "attachment" : "inline", originalName);
        return ResponseEntity.ok().headers(headers).body(resource);
    }
}
